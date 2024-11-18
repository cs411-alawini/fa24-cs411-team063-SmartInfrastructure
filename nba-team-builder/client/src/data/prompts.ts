import { Prompt } from "../types/prompt";

const prompts: Prompt[] = [
  {
    id: "ppg_above_10",
    criteria: [
      { stat: "PTS", operator: ">", value: 10 },
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
    id: "double_double",
    criteria: [
      { stat: "PTS", operator: ">=", value: 10 },
      { stat: "REB", operator: ">=", value: 10 },
    ],
    logicalOperator: "AND",
  },
  {
    id: "apg_or_reb_above_5",
    criteria: [
      { stat: "AST", operator: ">", value: 5 },
      { stat: "REB", operator: ">", value: 5 },
    ],
    logicalOperator: "OR",
  },
];

export default prompts;
