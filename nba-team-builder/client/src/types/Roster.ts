// src/types/Roster.ts

// src/types/Roster.ts

export interface Player {
  player_id: number;
  first_name: string;
  last_name: string;
  team_name: string;
  salary: number;
}

export interface Roster {
  roster_id: number;
  user_id: number;
  prompt_id: number;
  total_salary: number;
  total_penalty: number;
  players: Player[];
  username?: string;
}
// src/types/Roster.ts

export interface Player {
  player_id: number;
  first_name: string;
  last_name: string;
  team_name: string;
  salary: number;
}

export interface Roster {
  roster_id: number;
  user_id: number;
  prompt_id: number;
  total_salary: number;
  total_penalty: number;
  players: Player[];
}

  
  export interface RosterResponse {
    rosters: Roster[];
    currentPage: number;
    totalPages: number;
    totalRosters: number;
  }
  