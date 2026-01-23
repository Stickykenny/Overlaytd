// db.ts
import Dexie, { Table } from "dexie";
import { Astre, AstreID } from "../models/Astre";
import { RowModelTransfer } from "../models/RowModel";

/**
 * Server Db is always the first source of truth
 */
export class AppDB extends Dexie {
  astres!: Table<Astre, [string, string, string]>;

  constructor() {
    //Dexie.delete("AstreOfflineDatabase"); // This will force reset browser database // TODO move out this logic to a proper debug interface
    super("AstreOfflineDatabase"); // Database name

    //https://dexie.org/docs/Tutorial/Design#database-versioning
    // Once keypath is set, it will be needed to remove it from browser application -> Storage -> IndexedDB -> this database -> delete
    // Else to update add a new version

    this.version(1).stores({
      astres: "[astreID.type+astreID.subtype+astreID.name]", // fields to be indexed
    });
  }

  /**
   * For populating database in it's first instance, or resetting it.
   *
   * @param astres Data to introduce
   */
  populateDb(astres: Astre[]): void {
    this.astres.clear();
    this.astres.bulkPut(astres).then(() => {
      console.log("Offline Database populated");
    });

    this.astres
      .toArray()
      .then((astreArray) => {})
      .catch((e) => {
        alert(e);
        throw e;
      });
  }

  async getItems(): Promise<Astre[]> {
    return await this.astres.toArray();
  }

  addItem(astre: Astre): void {
    this.astres.put(astre);
    console.log("Added to offline database");
  }

  addItems(astres: Astre[]): void {
    console.log(astres);
    this.astres.bulkPut(astres);
    console.log("Added multiples to offline database");
  }

  deleteItem(astreId: AstreID): void {
    this.astres.delete([astreId.type, astreId.subtype, astreId.name]);
    console.log("Deleted from offline database");
  }

  /**
   * This function helps in syncing with remote data by calculating data that needs to be updated/removed
   *
   * @param astresRemote Array of Data to compare with
   * @returns An array of 2 array : 1st is an array of item to update, 2nd is an array of item to remove
   */
  getDifference(astresRemote: Astre[]): Astre[][] {
    let toUpdateArr: Astre[];
    let toDeleteArr: Astre[];
    let returnArr: Astre[][] = [];

    this.getItems()
      .then((astreArray) => {
        const localTruth = new Set(astreArray);
        const remoteTruth = new Set(astresRemote);
        toUpdateArr = [...localTruth].filter((x) => !remoteTruth.has(x));
        toDeleteArr = [...remoteTruth].filter((x) => !localTruth.has(x));
        return returnArr.push(toUpdateArr, toDeleteArr);
      })
      .catch((e) => {
        alert(e);
        throw e;
      });
    return returnArr;
  }
}

export const offlineDb = new AppDB();
