import {
  ATTENDANCE_COLLECTION_ID,
  CLASSES_COLLECTION_ID,
  DATABASE_ID,
  ENDPOINT,
  LECTURES_COLLECTION_ID,
  PLATFORM,
  PROJECT_ID,
  STORAGE_ID,
  STUDENTS_COLLECTION_ID,
  USERS_COLLECTION_ID,
} from "@/env";
import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";
const client = new Client();

const endpoint = ENDPOINT;
const project = PROJECT_ID;
const platform = PLATFORM;
const databaseID = DATABASE_ID;
const userCollection = USERS_COLLECTION_ID;
const studentsCollection = STUDENTS_COLLECTION_ID;
const attendenceCollection = ATTENDANCE_COLLECTION_ID;
const lecturesCollection = LECTURES_COLLECTION_ID;
const classCollection = CLASSES_COLLECTION_ID;
const storageID = STORAGE_ID;

client.setEndpoint(endpoint).setProject(project).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const database = new Databases(client);
export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error("Error creating user");
    const avatarURL = avatars.getInitials(username);
    await signIn(email, password);
    const newUser = await database.createDocument(
      databaseID,
      userCollection,
      ID.unique(),
      { accountID: newAccount.$id, username, email, avatar: avatarURL }
    );
    return newUser;
  } catch (error: any) {
    console.log();
    throw new Error(error.message);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    if (!session) throw new Error("Error signing in");
    return session;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw new Error("Error getting current user");
    }
    const currentUser = await database.listDocuments(
      databaseID,
      userCollection,
      [Query.equal("accountID", currentAccount.$id)]
    );
    if (!currentUser) throw new Error("Error getting current user");
    return currentUser.documents[0];
  } catch (error) {}
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error("Error signing out");
  }
};

export const getLectures = async (day: number) => {
  try {
    const lectures = await database.listDocuments(
      databaseID,
      lecturesCollection,
      [Query.orderDesc("$createdAt"), Query.equal("day", day)]
    );
    if (!lectures) throw new Error("Error getting lectures");
    return lectures.documents;
  } catch (error) {
    console.log(error);
  }
};
export const getStudents = async () => {
  try {
    const students = await database.listDocuments(
      databaseID,
      studentsCollection,
      [Query.orderAsc("roll_no")]
    );
    if (!students) throw new Error("Error getting students");
    return students.documents;
  } catch (error) {
    console.log(error);
  }
};

export const getAttendence = async (date: Date) => {
  try {
    const attendence = await database.listDocuments(
      databaseID,
      attendenceCollection,
      [Query.orderAsc("date"), Query.equal("date", date.toISOString())]
    );
    if (!attendence) throw new Error("Error getting attendence");
    return attendence.documents;
  } catch (error) {
    console.log(error);
  }
};

export const getClass = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Error getting current user");
    const all_classes = await database.listDocuments(
      databaseID,
      classCollection,
      [Query.equal("cr", currentUser.$id)]
    );
    if (!all_classes) throw new Error("Error getting class");
    return all_classes.documents;
  } catch (error) {
    console.log(error);
  }
};

export const createClass = async (name: string, semester: string) => {
  const intsem = parseInt(semester);
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Error getting current user");
    const newClass = await database.createDocument(
      databaseID,
      classCollection,
      ID.unique(),
      { name, semester: intsem, cr: currentUser.$id }
    );
    if (!newClass) throw new Error("Error creating class");
    return newClass;
  } catch (error) {}
};
