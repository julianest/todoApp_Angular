export interface Task{
  id: number;
  title: string;
  completed: boolean;
  editing?: boolean;  //Para dejarlo opcional se pone ?
}
