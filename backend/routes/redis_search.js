const router = require("express").Router();
const { redis_client, redis_port } = require("../redis");
const fetch = require("node-fetch");

/*---------- Git repo count sample redis function with model, middleware, controller  ----------*/

const setResponse = (username, repos) => {
  return `<h2>${username} has ${repos} Github Repos.</h2>`;
};

const getGitGud = async (req, res, next) => {
  try {
    console.log("fetching data");

    const { username } = req.params;

    const response = await fetch(`https://api.github.com/users/${username}`);

    const data = await response.json();

    const repos = data.public_repos;

    // set data to redis
    redis_client.setex(username, 360, repos);

    res.send(setResponse(username, repos));
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};

// cache middleware btw request & response cycle

const cache = (req, res, next) => {
  const { username } = req.params;

  redis_client.get(username, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(setResponse(username, data));
    } else {
      next();
    }
  });
};

/*---------- Implemeting trie based search auto complete feature ----------*/
/*
  Algorithm preprocesses the input stringArray []
  Creates a trie with unique ID (eg oaktree3517) for redis storage
  Search function will return set of matching strings like auto-complete
*/

const alphabet_size = 26;

class trieNode {
  constructor(value) {
    this.children = {};
    this.character = value;
    this.endNode = false;
  }

  setEndNode(boolval) {
    const setEndNodeHelper = (node, val) => {
      node.endNode = val;
    };
    setEndNodeHelper(this, boolval);
  }

  addChildren(newNode) {
    const addChildrenHelper = (node, newNode) => {
      node.children[newNode.character] = newNode;
    };
    addChildrenHelper(this, newNode);
  }
}

class trie {
  constructor() {
    this.root = new trieNode(null);
  }

  addWord(str) {
    const addWordHelper = (root, str) => {
      let i = 0;
      let curNode = root;
      while (i < str.length) {
        let flag = 0;
        const keys = Object.keys(curNode.children);

        for (let j = 0; j < keys.length; j++) {
          const cnode = curNode.children[keys[j]];
          if (cnode.character === str[i]) {
            curNode = cnode;
            flag = 1;
            break;
          }
        }
        if (flag === 0) {
          const cnode = new trieNode(str[i]);
          curNode.addChildren(cnode);
          curNode = cnode;
        }
        if (i === str.length - 1) {
          curNode.setEndNode(true);
        }
        i++;
      }
    };
    addWordHelper(this.root, str);
  }

  displayTrie() {
    const displayTrieHelper = (root, prev, top) => {
      console.log(root.character, prev.character, root.endNode);
      const keys = Object.keys(root.children);
      for (let j = 0; j < keys.length; j++) {
        const cnode = root.children[keys[j]];
        displayTrieHelper(cnode, root, top + j + 1);
      }
    };
    displayTrieHelper(this.root, this.root, this.root);
  }

  createTrie(stringArray) {
    const createTrieHelper = (stringArray) => {
      const root = new trieNode(null);
      stringArray.forEach((str) => {
        this.addWord(str, root);
      });
    };
    createTrieHelper(stringArray);
  }

  autocomplete(str) {
    const foundTrie = (root, str) => {
      let curNode = root;
      let i = 0;
      while (i < str.length) {
        if (str[i] in curNode.children) {
          curNode = curNode.children[str[i]];
          i++;
        } else {
          return undefined;
        }
      }
      return curNode;
    };

    const itemList = [];

    const itemListFinder = (str, node) => {
      // dfs like algorithm
      if (node.endNode) {
        itemList.push(str);
      }
      for (let i in node.children) {
        const child = node.children[i];
        const newstring = str + child.character;
        itemListFinder(newstring, child);
      }
    };

    const matchFoundTrie = foundTrie(this.root, str);

    if (matchFoundTrie) {
      itemListFinder(str, matchFoundTrie);
    } else {
      console.log("No Prefix match!");
    }

    return itemList;
  }
}

// const data = ["baby", "food", "best"];

// const oaktree3517 = new trie();
// oaktree3517.createTrie(data);
// oaktree3517.displayTrie();
// console.log(oaktree3517.autocomplete("bab"));

const setTrieResponse = (itemname, stringArray) => {
  // const response = {data: stringArray};
  return stringArray;
};

const fetchItems = async (req, res, next) => {
  const { itemname } = req.params;

  const response = await fetch("http://localhost:5000/items");

  const data = await response.json();

  const itemList = [];

  const oaktree3517 = new trie();

  data.forEach((item) => {
    itemList.push(item.itemname);
  });

  oaktree3517.createTrie(itemList);

  const resData = oaktree3517.autocomplete(itemname);

  if (resData) {
    var multi = redis_client.multi();

    for (var i = 0; i < resData.length; i++) {
      multi.rpush(itemname, resData[i]);
    }

    multi.EXPIRE(itemname, 120);

    multi.exec(function (errors, results) {});
  }

  res.json(setTrieResponse(itemname, resData));
};

const trieCache = (req, res, next) => {
  const { itemname } = req.params;

  redis_client.lrange(itemname, 0, 10, (err, data) => {
    if (err) throw err;

    if (data !== null && data.length !== 0) {
      console.log("invoking cache");
      console.log(data);
      res.send(setTrieResponse(itemname, data));
    } else {
      console.log("fetching data from api...");
      next();
    }
  });
};

/*---------- Routes declaration  ----------*/
router.route("/").get((req, res) => {
  res.send("Redis based search");
});

router.route("/repos/:username").get(cache, getGitGud);

router.route("/byname/").get((req, res) => {
  res.send([]);
});;

router.route("/byname/:itemname").get(trieCache, fetchItems);

module.exports = router;
