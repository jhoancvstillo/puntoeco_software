// // types.ts

// export type ProductionEntry = {
//   id?: number;
//   date: string;
//   bales: number;
//   estimatedWeight: number;
// };

// export type DispatchEntry = {
//   date: string;
//   bales: number;
//   weight: number;
//   destination: string;
// };

// export type DebtEntry = {
//   date: string;
//   reportedWeight: number;
//   acceptedWeight: number;
//   pendingWeight: number;
// };

// export type AppState = {
//   production: ProductionEntry[];
//   dispatches: DispatchEntry[];
//   debt: DebtEntry[];
//   inventory: {
//     totalBales: number;
//     estimatedWeight: number;
//   };
//   statistics: {
//     totalProduction: number;
//     totalDispatches: number;
//     pendingDebt: number;
//     averageBalesPerDay: number;
//   };
// };

// export type Action =
//   | { type: 'ADD_PRODUCTION'; payload: ProductionEntry }
//   | { type: 'ADD_DISPATCH'; payload: DispatchEntry }
//   | { type: 'UPDATE_DEBT'; payload: DebtEntry }
//   | { type: 'SET_STATISTICS'; payload: AppState['statistics'] }
//   | { type: 'SET_INVENTORY'; payload: AppState['inventory'] }
//   | { type: 'SET_PRODUCTION'; payload: ProductionEntry[] }
//   | { type: 'SET_DISPATCHES'; payload: DispatchEntry[] }
//   | { type: 'SET_DEBT'; payload: DebtEntry[] };

// export type DateRange = {
//   from: Date;
//   to: Date;
// };

// export type OnSubmitHandler<T> = (data: T) => Promise<void>;

// export const initialState: AppState = {
//   production: [],
//   dispatches: [],
//   debt: [],
//   inventory: {
//     totalBales: 0,
//     estimatedWeight: 0,
//   },
//   statistics: {
//     totalProduction: 0,
//     totalDispatches: 0,
//     pendingDebt: 0,
//     averageBalesPerDay: 0,
//   },
// };

// export function appReducer(state: AppState, action: Action): AppState {
//   switch (action.type) {
//     case 'ADD_PRODUCTION':
//       return {
//         ...state,
//         production: [...state.production, action.payload],
//         inventory: {
//           totalBales: Math.max(state.inventory.totalBales + action.payload.bales, 0),
//           estimatedWeight: Math.max(
//             state.inventory.estimatedWeight + action.payload.estimatedWeight,
//             0
//           ),
//         },
//       };
//     case 'ADD_DISPATCH':
//       return {
//         ...state,
//         dispatches: [...state.dispatches, action.payload],
//         inventory: {
//           totalBales: Math.max(state.inventory.totalBales - action.payload.bales, 0),
//           estimatedWeight: Math.max(
//             state.inventory.estimatedWeight - action.payload.weight,
//             0
//           ),
//         },
//       };
//     case 'UPDATE_DEBT':
//       return {
//         ...state,
//         debt: state.debt.map((entry) =>
//           entry.date === action.payload.date ? action.payload : entry
//         ),
//       };
//     case 'SET_STATISTICS':
//       return {
//         ...state,
//         statistics: action.payload,
//       };
//     case 'SET_INVENTORY':
//       return {
//         ...state,
//         inventory: action.payload,
//       };
//     case 'SET_PRODUCTION':
//       return {
//         ...state,
//         production: action.payload,
//       };
//     case 'SET_DISPATCHES':
//       return {
//         ...state,
//         dispatches: action.payload,
//       };
//     case 'SET_DEBT':
//       return {
//         ...state,
//         debt: action.payload,
//       };
//     default:
//       return state;
//   }
// }



// HECHO POR MI CUENTA



export interface Production {
    id: number;
    date: string;
    bales: number;
    estimated_weight: number;
}

export interface Dispatch {
    id: number;
    date: string;
    bales: number;
    weight: number;
    destination: string;
}

export interface Debt {
    id: number;
    date: string;
    reported_weight: number;
    accepted_weight: number;
    pending_weight: number;
}


export interface addBalesForm{
    date: string;
    bales: number;
}


export interface addDispatchForm{
    date: string;
    bales: number;
    destination: string;
}

export interface addDebtForm{
    date: string;
    reported_weight: number;
    accepted_weight: number;
}

