export interface Criterion {
    stat: string; // The stat to evaluate (e.g., PTS, AST, REB)
    operator: string; // Comparison operator (e.g., >, <, >=, <=)
    value: number; // Threshold value
  }
  
export interface Prompt {
    id: string; // Unique identifier for the prompt
    criteria: Criterion[]; // List of criteria
    logicalOperator?: "AND" | "OR"; // How to combine multiple criteria (default: AND)
    description?: string; // Optional static description
  }