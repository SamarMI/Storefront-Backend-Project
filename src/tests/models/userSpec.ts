import { User, UserStore } from "../../models/user";

const store = new UserStore();

describe(" test user Model", () => {

  const user = {
    firstName: "samar",
    lastName: "mohamed",
    password: "0111sss",
  };
  let user_id:number;

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("should create a user ", async () => {
    
    const result = await store.create(
      user.firstName,
      user.lastName,
      user.password
    );
    // i added ts-ignore as database colmns are small litters
    // as result.firstName not defined and firstname not exist in type User

    //@ts-ignore
    expect(result.firstname).toEqual(user.firstName);
    //@ts-ignore
    expect(result.lastname).toEqual(user.lastName);
    expect(result.password_digest).not.toEqual(user.password);
    user_id= result.id;
  });

  it("should return all users ", async () => {
    const result = await store.index();
    const userIndrex = result.length - 1;

    expect(result[userIndrex].id).toEqual(user_id);
    //@ts-ignore
    expect(result[userIndrex].firstname).toEqual("samar");
    //@ts-ignore
    expect(result[userIndrex].lastname).toEqual("mohamed");
    expect(result[userIndrex].password_digest.length).toBeGreaterThanOrEqual(
      60
    );
    expect(result[userIndrex].password_digest).not.toEqual("0111sss");
  });

  it("should  faild to return all users with out use @ts-ignore ", async () => {
    const result = await store.index();
    const userIndrex = result.length - 1;
    expect(result[userIndrex].id).toEqual(user_id);
    expect(result[userIndrex].firstName).not.toEqual("samar");
    expect(result[userIndrex].lastName).not.toEqual("mohamed");
    expect(result[userIndrex].password_digest).not.toEqual("0111sss");
  });

  it("should show the correct user ", async () => {
    const result: User = await store.show(`${user_id}`);
    expect(result.id).toEqual(user_id);
    //@ts-ignore
    expect(result.firstname).toEqual("samar");
    //@ts-ignore
    expect(result.lastname).toEqual("mohamed");
    expect(result.password_digest.length).toBeGreaterThanOrEqual(60);
  });
  it("should delete the correct user ", async () => {
    store.delete(`${user_id}`);
    const result = await store.index();

    expect(result).toBeNull;
  });
});
