import { Prompt } from "../types/prompt";

const prompts: Prompt[] = [
  {
    id: "ppg_above_10",
    criteria: [
      { stat: "PTS", operator: ">", value: 10 },
    ],
  },
  {
    id: "apg_above_3",
    criteria: [
      { stat: "AST", operator: ">", value: 3 },
    ],
  },
  {
    id: "blk_at_least_1",
    criteria: [
      { stat: "BLK", operator: ">=", value: 1 },
    ],
  },
  {
    id: "ppg_above_5_and_below_10",
    criteria: [
      { stat: "PTS", operator: ">", value: 5 },
      { stat: "PTS", operator: "<", value: 10 },
    ],
    logicalOperator: "AND",
  },
  {
    id: "ppg_above_1",
    criteria: [
      { stat: "PTS", operator: ">=", value: 1 },
    ],
  },
  {
    id: "apg_or_reb_above_5",
    criteria: [
      { stat: "AST", operator: ">", value: 5 },
      { stat: "REB", operator: ">", value: 5 },
    ],
    logicalOperator: "OR",
  },
  {
    id: "ppg_at_least_20",
    criteria: [
      { stat: "PTS", operator: ">=", value: 20 },
    ],
  },
];

export default prompts;
