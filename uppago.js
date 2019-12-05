const math = require('mathjs');
const fs = require('fs-extra');
const UPGRADE_PRICE = 338;
const INNOCENT_PRICE = 1250;
const WHITE_PRICE = 500;
const HAMMER_PRICE = 500;
const UPGRADE_PERCENTAGE = 0.39;
const INNOCENT_PERCENTAGE = 0.45;
const WHITE_PERCENTAGE = 0.1;
const HAMMER_PERCENTAGE = 0.5;

function tryUpgrade(state) {
  state.upgrade += 1;
  state.left -= 1;
  if (Math.random() < UPGRADE_PERCENTAGE) {
    state.success += 1;
  }
}

function tryInnocent(state) {
  state.innocent += 1 / INNOCENT_PERCENTAGE;
  state.success = 0;
  state.left = 8;
  state.hammerApplied = false;
}

function tryWhite(state) {
  state.white += 1 / WHITE_PERCENTAGE;
  state.left += 1;
}

function tryHammer(state) {
  state.hammer += 1;
  state.hammerApplied = true;
  if (Math.random() < HAMMER_PERCENTAGE) {
    state.left += 1;
  }
}

function canUpgrade(state) {
  return state.left > 0;
}

function canWhite(state) {
  if (state.hammerApplied && state.left + state.success === 9) {
    return false;
  }
  if (!state.hammerApplied && state.left + state.success === 8) {
    return false;
  }
  return true;
}

function canInnocent(state) {
  if (state.hammerApplied === false && state.left === 8) {
    return false;
  }
  return true;
}

function canHammer(state) {
  return !state.hammerApplied;
}

const canAction = {
  upgrade: state => canUpgrade(state),
  white: state => canWhite(state),
  innocent: state => canInnocent(state),
  hammer: state => canHammer(state),
};

const tryAction = {
  upgrade: state => tryUpgrade(state),
  white: state => tryWhite(state),
  innocent: state => tryInnocent(state),
  hammer: state => tryHammer(state),
};

function calculateUCT(child, parent) {
  if (!child) {
    return -999999;
  }
  return (
    child.reward / child.visited +
    math.sqrt((2 * math.log(parent.visited)) / child.visited)
  );
}

function calculateUCT2(child1, child2, parent) {
  if (!child1) {
    return calculateUCT(child2, parent);
  }
  if (!child2) {
    return calculateUCT(child1, parent);
  }
  return (
    (child1.reward + child2.reward) / (child1.visited + child2.visited) +
    math.sqrt(
      (2 * math.log(parent.visited)) / (child1.visited + child2.visited),
    )
  );
}

function getRandomActionArray() {
  return ['upgrade', 'hammer', 'white', 'innocent'].sort(
    (a, b) => (Math.random() > 0.5 ? 1 : -1),
  );
}

function select(root) {
  let selected = root;
  while (true) {
    const upgradeVisited =
      !canUpgrade(selected) ||
      selected.children.upgradeSuccess ||
      selected.children.upgradeFail;
    const whiteVisited = !canWhite(selected) || selected.children.white;
    const innocentVisited =
      !canInnocent(selected) || selected.children.innocent;
    const hammerVisited =
      !canHammer(selected) ||
      selected.children.hammerSuccess ||
      selected.children.hammerFail;
    if (upgradeVisited && whiteVisited && innocentVisited && hammerVisited) {
      const UCT = {
        upgrade: calculateUCT2(
          selected.children.upgradeSuccess,
          selected.children.upgradeFail,
          selected,
        ),
        white: calculateUCT(selected.children.white, selected),
        innocent: calculateUCT(selected.children.innocent, selected),
        hammer: calculateUCT2(
          selected.children.hammerSuccess,
          selected.children.hammerFail,
          selected,
        ),
      };
      let max = 'upgrade';
      if (UCT['white'] > UCT[max]) {
        max = 'white';
      }
      if (UCT['innocent'] > UCT[max]) {
        max = 'innocent';
      }
      if (UCT['hammer'] > UCT[max]) {
        max = 'hammer';
      }
      if (max === 'upgrade') {
        if (Math.random() < UPGRADE_PERCENTAGE) {
          if (!selected.children.upgradeSuccess) {
            selected.children.upgradeSuccess = {
              success: selected.success + 1,
              left: selected.left - 1,
              hammerApplied: selected.hammerApplied,
              upgrade: selected.upgrade + 1,
              innocent: selected.innocent,
              white: selected.white,
              hammer: selected.hammer,
              children: {},
              visited: 0,
              reward: 0,
              parent: selected,
            };
            return selected.children.upgradeSuccess;
          }
          selected = selected.children.upgradeSuccess;
        } else {
          if (!selected.children.upgradeFail) {
            selected.children.upgradeFail = {
              success: selected.success,
              left: selected.left - 1,
              hammerApplied: selected.hammerApplied,
              upgrade: selected.upgrade + 1,
              innocent: selected.innocent,
              white: selected.white,
              hammer: selected.hammer,
              children: {},
              visited: 0,
              reward: 0,
              parent: selected,
            };
            return selected.children.upgradeFail;
          }
          selected = selected.children.upgradeFail;
        }
      }
      if (max === 'white') {
        selected = selected.children.white;
      }
      if (max === 'innocent') {
        selected = selected.children.innocent;
      }
      if (max === 'hammer') {
        if (Math.random() < HAMMER_PERCENTAGE) {
          if (!selected.children.hammerSuccess) {
            selected.children.hammerSuccess = {
              success: selected.success,
              left: selected.left + 1,
              hammerApplied: true,
              upgrade: selected.upgrade,
              innocent: selected.innocent,
              white: selected.white,
              hammer: selected.hammer + 1,
              children: {},
              visited: 0,
              reward: 0,
              parent: selected,
            };
            return selected.children.hammerSuccess;
          }
          selected = selected.children.hammerSuccess;
        } else {
          if (!selected.children.hammerFail) {
            selected.children.hammerFail = {
              success: selected.success,
              left: selected.left,
              hammerApplied: true,
              upgrade: selected.upgrade,
              innocent: selected.innocent,
              white: selected.white,
              hammer: selected.hammer + 1,
              children: {},
              visited: 0,
              reward: 0,
              parent: selected,
            };
            return selected.children.hammerFail;
          }
          selected = selected.children.hammerFail;
        }
      }
    } else {
      if (!upgradeVisited) {
        if (Math.random() < UPGRADE_PERCENTAGE) {
          selected.children.upgradeSuccess = {
            success: selected.success + 1,
            left: selected.left - 1,
            hammerApplied: selected.hammerApplied,
            upgrade: selected.upgrade + 1,
            innocent: selected.innocent,
            white: selected.white,
            hammer: selected.hammer,
            children: {},
            visited: 0,
            reward: 0,
            parent: selected,
          };
          return selected.children.upgradeSuccess;
        } else {
          selected.children.upgradeFail = {
            success: selected.success,
            left: selected.left - 1,
            hammerApplied: selected.hammerApplied,
            upgrade: selected.upgrade + 1,
            innocent: selected.innocent,
            white: selected.white,
            hammer: selected.hammer,
            children: {},
            visited: 0,
            reward: 0,
            parent: selected,
          };
          return selected.children.upgradeFail;
        }
      }
      if (!whiteVisited) {
        selected.children.white = {
          success: selected.success,
          left: selected.left + 1,
          hammerApplied: selected.hammerApplied,
          upgrade: selected.upgrade,
          innocent: selected.innocent,
          white: selected.white + 1 / WHITE_PERCENTAGE,
          hammer: selected.hammer,
          children: {},
          visited: 0,
          reward: 0,
          parent: selected,
        };
        return selected.children.white;
      }
      if (!innocentVisited) {
        selected.children.innocent = {
          success: 0,
          left: 8,
          hammerApplied: false,
          upgrade: selected.upgrade,
          innocent: selected.innocent + 1 / INNOCENT_PERCENTAGE,
          white: selected.white,
          hammer: selected.hammer,
          children: {},
          visited: 0,
          reward: 0,
          parent: selected,
        };
        return selected.children.innocent;
      }
      if (!hammerVisited) {
        if (Math.random() < HAMMER_PERCENTAGE) {
          selected.children.hammerSuccess = {
            success: selected.success,
            left: selected.left + 1,
            hammerApplied: true,
            upgrade: selected.upgrade,
            innocent: selected.innocent,
            white: selected.white,
            hammer: selected.hammer + 1,
            children: {},
            visited: 0,
            reward: 0,
            parent: selected,
          };
          return selected.children.hammerSuccess;
        } else {
          selected.children.hammerFail = {
            success: selected.success,
            left: selected.left,
            hammerApplied: true,
            upgrade: selected.upgrade,
            innocent: selected.innocent,
            white: selected.white,
            hammer: selected.hammer + 1,
            children: {},
            visited: 0,
            reward: 0,
            parent: selected,
          };
        }
        return selected.children.hammerFail;
      }
    }
  }
}

function rollout(node) {
  const rolloutState = { ...node };
  while (true) {
    if (rolloutState.success === 9) {
      break;
    }
    const actions = getRandomActionArray();
    for (let action of actions) {
      if (action === 'innocent') {
        if (!(rolloutState.success <= 4 && rolloutState.left <= 4)) {
          continue;
        }
      }
      if (action === 'white') {
        if (rolloutState.left > 0) {
          continue;
        }
      }
      if (canAction[action](rolloutState)) {
        tryAction[action](rolloutState);
        break;
      }
    }
  }
  return rolloutState;
}

function backpropagate(node, result, max, min) {
  let i = node;
  while (i !== null) {
    const cost = Math.min(
      result.upgrade * UPGRADE_PRICE +
        result.white * WHITE_PRICE +
        result.innocent * INNOCENT_PRICE +
        result.hammer * HAMMER_PRICE,
      max / 3,
    );
    i.visited += 1;
    i.reward += (max / 3 - cost) / (max / 3 - min / 3);
    i = i.parent;
  }
}

function main() {
  let policy = {};
  for (let i = 0; i <= 8; i++) {
    for (let j = 8 - i; j >= 0; j--) {
      const root = {
        success: i,
        left: j,
        hammerApplied: false,
        upgrade: 0,
        innocent: 0,
        white: 0,
        hammer: 0,
        children: {},
        visited: 0,
        reward: 0,
        parent: null,
      };
      let min = 999999;
      let a = 0;
      for (let t = 1; t <= 10000; t++) {
        const result = rollout(root);
        const cost =
          result.upgrade * UPGRADE_PRICE +
          result.white * WHITE_PRICE +
          result.innocent * INNOCENT_PRICE +
          result.hammer * HAMMER_PRICE;
        min = Math.min(cost, min);
        a += cost / 10000;
      }
      console.log(min, a)
      for (let t = 1; t <= 100000; t++) {
        const selected = select(root);
        const result = rollout(selected);
        backpropagate(selected, result, a * 9, min);
      }

      let bestChild;
      let best = 0;
      if (root.children.upgradeSuccess) {
        if (
          root.children.upgradeFail.visited +
            root.children.upgradeSuccess.visited >
          best
        ) {
          bestChild = 'upgrade';
          best =
            root.children.upgradeFail.visited +
            root.children.upgradeSuccess.visited;
        }
      }
      if (root.children.white) {
        if (root.children.white.visited > best) {
          bestChild = 'white';
          best = root.children.white.visited;
        }
      }
      if (root.children.innocent) {
        if (root.children.innocent.visited > best) {
          bestChild = 'innocent';
          best = root.children.innocent.visited;
        }
      }
      if (root.children.hammerSuccess) {
        if (
          root.children.hammerFail.visited +
            root.children.hammerSuccess.visited >
          best
        ) {
          bestChild = 'hammer';
          best =
            root.children.hammerFail.visited +
            root.children.hammerSuccess.visited;
        }
      }
      console.log(`${i}-${j}-false`, bestChild);
      policy[`${i}-${j}-false`] = bestChild;
    }
  }
  console.log(policy);
}

main();
