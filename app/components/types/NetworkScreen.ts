export default interface NetworkScreen {
  name: string;
  ip: string;
  id: string;
  owned: boolean;
  setup: boolean;
  restarting: boolean;
}
