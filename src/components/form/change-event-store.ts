export type ChangeHandlerFunc = {
  name: string;
  func: (value: any) => void;
};

export class ChangeEventStore {
  private observers: ChangeHandlerFunc[] = [];
  

  public addListener = (name: string, func: (value: any) => void) => {
    if (!name) {
      throw new Error("name cannot be empty.");
    }

    if (!func) {
      throw new Error("listener cannot be empty.");
    }

    this.observers = [
      ...this.observers,
      {
        name,
        func,
      },
    ];
  };

  public removeListener = (name: string, func: (value: any) => void) => {
    if (!name) {
      throw new Error("name cannot be empty.");
    }

    if (!func) {
      throw new Error("listener cannot be empty.");
    }

    this.observers = this.observers.filter(
      (f) => name !== f.name && func !== f.func
    );
  };

  public emitChange = (name: string, value: string) => {
    this.observers
      .filter((f) => f.name === name || f.name === "")
      .forEach((f) => f.func(value));
  };

  public getObservers (){
    return this.observers;
  }
}
