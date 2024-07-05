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
  Storage,
  Databases,
  Query,
  ImageGravity,
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
const storage = new Storage(client);
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

export const getSpecificLecture = async (lectureID: any) => {
  try {
    const lecture = await database.listDocuments(
      databaseID,
      lecturesCollection,
      [Query.equal("$id", lectureID)]
    );
    if (!lecture) throw new Error("Error getting lecture");
    return lecture.documents;
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
  } catch (error) {
    console.log(error);
  }
};

export const createLecture = async (
  name: string,
  teacher: string,
  creditHours: string,
  duration: string,
  time: Date,
  day: number
) => {
  const intCh = parseInt(creditHours);
  const intDur = parseInt(duration);
  try {
    const currentClass = await getClass();
    if (!currentClass) throw new Error("Error getting class");
    const newLecture = await database.createDocument(
      databaseID,
      lecturesCollection,
      ID.unique(),
      {
        name,
        teacher,
        credit_hours: intCh,
        duration: intDur,
        time,
        day,
        classes: currentClass[0].$id,
      }
    );
    if (!newLecture) throw new Error("Error creating lecture");
    return newLecture;
  } catch (error) {
    console.log(error);
  }
};

export async function getFilePreview(fileId: string) {
  let fileUrl;

  try {
    fileUrl = storage.getFilePreview(
      storageID,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}

export const uploadFile = async (file: any) => {
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };
  try {
    const uploadedFile = await storage.createFile(
      storageID,
      ID.unique(),
      asset
    );
    console.log("uploaded", uploadedFile.$id);
    const fileUrl = await getFilePreview(uploadedFile.$id);
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
};

export const createStudent = async (
  name: string,
  roll_no: string,
  avatar?: any
) => {
  try {
    let avatarURL;
    if (avatar) {
      avatarURL = await uploadFile(avatar);
    }
    if (!avatar) {
      avatarURL = avatars.getInitials(name);
    }
    console.log(avatarURL);
    const className = await getClass();
    if (!className) throw new Error("Error getting class");
    const newStudent = await database.createDocument(
      databaseID,
      studentsCollection,
      ID.unique(),
      { name, roll_no, avatar: avatarURL, class: className[0].$id }
    );
    if (!newStudent) throw new Error("Error creating student");
    return newStudent;
  } catch (error) {
    console.log(error);
  }
};

export const changePfp = async (avatar: any) => {
  const avatarUrl = await uploadFile(avatar);

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Error getting user");
    }
    const newItem = await database.updateDocument(
      databaseID,
      userCollection,
      currentUser.$id,
      {
        avatar: avatarUrl,
      }
    );
    if (!newItem) throw new Error("Error updating data");
    return newItem;
  } catch (error) {
    console.log(error);
  }
};

export const getStudentData = async (studentID: any) => {
  try {
    const student = await database.listDocuments(
      databaseID,
      studentsCollection,
      [Query.equal("$id", studentID)]
    );
    if (!student) throw new Error("Error getting student");
    return student.documents;
  } catch (error) {
    console.log(error);
  }
};

export const deleteStudent = async (studentID: any) => {
  try {
    const student = await database.deleteDocument(
      databaseID,
      studentsCollection,
      studentID
    );
    if (!student) throw new Error("Error deleting student");
    return student;
  } catch (error) {
    console.log(error);
  }
};

export const updateStudent = async (
  id: any,
  name: string,
  roll_no: string,
  avatar: any
) => {
  try {
    let avatarURL;
    if (typeof avatar === "string") {
      avatarURL = avatar;
      const newItem = await database.updateDocument(
        databaseID,
        studentsCollection,
        id,
        {
          name,
          roll_no,
        }
      );
      if (!newItem) throw new Error("Error updating data");
      return newItem;
    } else {
      avatarURL = await uploadFile(avatar);

      const newItem = await database.updateDocument(
        databaseID,
        studentsCollection,
        id,
        {
          name,
          roll_no,
          avatar: avatarURL,
        }
      );
      if (!newItem) throw new Error("Error updating data");
      return newItem;
    }
  } catch (error) {
    console.log(error);
  }
};

export const editLecture = async (
  id: any,
  name: string,
  teacher: string,
  creditHours: number,
  duration: number,
  time: string
) => {
  try {
    const newLecture = await database.updateDocument(
      databaseID,
      lecturesCollection,
      id,
      {
        name,
        teacher,
        credit_hours: creditHours,
        duration,
        time,
      }
    );
    if (!newLecture) throw new Error("Error editing lecture");
    return newLecture;
  } catch (error) {
    console.log(error);
  }
};

export const deleteLecture = async (lectureID: any) => {
  try {
    const lecture = await database.deleteDocument(
      databaseID,
      lecturesCollection,
      lectureID
    );
    if (!lecture) throw new Error("Error deleting lecture");
    return lecture;
  } catch (error) {
    console.log(error);
  }
};

export const markAttendence = async (
  lectureID: any,
  absentStudents: any[],
  date: Date
) => {
  try {
    console.log("Mark function called for id: ", absentStudents);
    const newAttendence = await database.createDocument(
      databaseID,
      attendenceCollection,
      ID.unique(),
      {
        lecture: lectureID,
        absent_students: absentStudents,
        marked_at: date.toISOString(),
        only_date: date.toLocaleDateString(),
      }
    );
    if (!newAttendence) throw new Error("Error marking attendence");
    return newAttendence;
  } catch (error) {
    console.log(error);
  }
};
export const updateAttendence = async (absent_students: any[], id: any) => {
  try {
    console.log("Update function called for id: ", id);
    const newAttendence = await database.updateDocument(
      databaseID,
      attendenceCollection,
      id,
      {
        absent_students: absent_students,
      }
    );
    if (!newAttendence) throw new Error("Error updating attendence");
    return newAttendence;
  } catch (error) {
    console.log(error);
  }
};

export const checkMarked = async (lectureID: any, date: Date) => {
  try {
    const attendence = await database.listDocuments(
      databaseID,
      attendenceCollection,
      [
        Query.equal("lecture", lectureID),
        Query.equal("only_date", date.toLocaleDateString()),
      ]
    );
    if (attendence.documents.length > 0) return attendence.documents;
    else return [];
  } catch (error) {
    console.log(error);
  }
};
