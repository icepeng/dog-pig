const UPGRADE_PERCENTAGE = 0.39;
const INNOCENT_PERCENTAGE = 0.45;
const WHITE_PERCENTAGE = 0.1;
const HAMMER_PERCENTAGE = 0.5;

const ACTION_MATRIX_NORMAL = [
  ['U', 'U', 'U', 'U', 'U', 'U', 'I', null, null],
  [null, 'U', 'U', 'U', 'U', 'U', 'U', 'I', null],
  [null, null, 'U', 'U', 'U', 'U', 'U', 'U', 'I'],
  [null, null, null, 'U', 'U', 'U', 'U', 'U', 'H'],
  [null, null, null, null, 'U', 'U', 'U', 'U', 'H'],
  [null, null, null, null, null, 'U', 'U', 'U', 'H'],
  [null, null, null, null, null, null, 'U', 'U', 'H'],
  [null, null, null, null, null, null, null, 'U', 'H'],
  [null, null, null, null, null, null, null, null, 'H'],
];

const ACTION_MATRIX_HAMMER = [
  ['U', 'U', 'U', 'U', 'U', 'U', 'I', null, null, null],
  [null, 'U', 'U', 'U', 'U', 'U', 'U', 'I', null, null],
  [null, null, 'U', 'U', 'U', 'U', 'U', 'U', 'I', null],
  [null, null, null, 'U', 'U', 'U', 'U', 'U', 'U', 'I'],
  [null, null, null, null, 'U', 'U', 'U', 'U', 'U', 'W'],
  [null, null, null, null, null, 'U', 'U', 'U', 'U', 'W'],
  [null, null, null, null, null, null, 'U', 'U', 'U', 'W'],
  [null, null, null, null, null, null, null, 'U', 'U', 'W'],
  [null, null, null, null, null, null, null, null, 'U', 'W'],
];

