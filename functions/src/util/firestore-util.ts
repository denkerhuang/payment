const admin = require("firebase-admin");
const db = admin.firestore();
const Logger = require("../livingmenu_lib/log-handler");
const LMError = require("../livingmenu_lib/error-handler");
const LMCONST = require("../Constant");
const name = "FsUtil";

const UK = {
  User: ["Email"],
  Session: ["StartTime", "LocationId"]
};

export function getRef(collectionName, documentId) {
  const h = Logger.orgLogHeader(name, "getRef");
  Logger.debug(`document : ${documentId}`, h);

  collectionName = finalCollectionName(collectionName);

  try {
    return db.collection(collectionName).doc(documentId);
  } catch (err) {
    throw new LMError(LMCONST.FirestoreError, {
      Message: err.message
    });
  }
}

function getRefArray(collectionName, documentIdArray) {
  const h = Logger.orgLogHeader(name, "getRefArray");
  Logger.debug(`document : ${documentIdArray}`, h);

  collectionName = finalCollectionName(collectionName);

  try {
    const refArray = [];
    documentIdArray.forEach(docId => {
      refArray.push(db.collection(collectionName).doc(docId));
    });
    return refArray;
  } catch (err) {
    throw new LMError(LMCONST.FirestoreError, {
      Message: err.message
    });
  }
}

function finalCollectionName(collectionName) {
  switch (collectionName) {
    case "Owner":
    case "Contact":
    case "Chef":
    case "Host":
      collectionName = LMCONST.Collection_User;
      break;
    default:
      collectionName = collectionName;
      break;
  }
  return collectionName;
}

export function changeIdToRef(dataObject) {
  Logger.orgLogHeader(name, "changeIdToRef");

  for (const key of Object.keys(dataObject)) {
    if (key.includes("Ids")) {
      const collectionName = key.split("Ids")[0];
      dataObject[collectionName + "Refs"] = getRefArray(
        collectionName,
        dataObject[key]
      );
      delete dataObject[key];
    } else if (key.includes("Id")) {
      const collectionName = key.split("Id")[0];
      dataObject[collectionName + "Ref"] = getRef(
        collectionName,
        dataObject[key]
      );
      delete dataObject[key];
    }
  }
  return dataObject;
}

export function changeRefToId(dataObject) {
  Logger.orgLogHeader(name, "changeRefToId");
  for (const key of Object.keys(dataObject)) {
    if (key.includes("Refs") && dataObject[key] !== undefined) {
      const idArray = [];
      dataObject[key].forEach(docRef => {
        idArray.push(docRef.id);
      });
      dataObject[key.split("Refs")[0] + "Ids"] = idArray;
      delete dataObject[key];
    } else if (key.includes("Ref") && dataObject[key] !== undefined) {
      const fieldName = key.split("Ref")[0];
      dataObject[fieldName + "Id"] = dataObject[key].id;
      delete dataObject[key];
    }
  }
  return dataObject;
}

//get document by document id
export async function getFSData(collectionName, documentId, callback) {
  await db
    .collection(collectionName)
    .doc(documentId)
    .get()
    .then(document => {
      console.log(
        "getFSData, collectionName: " +
          collectionName +
          ", documentId: " +
          documentId
      );
      if (document.exists) {
        const fsData = document.data();
        const correspondingIdName = collectionName + "Id";
        fsData[correspondingIdName] = document.id;
        callback(fsData);
      } else {
        callback({});
      }
    });
}

//get document by document ref
export async function getFSDataByRef(collectionName, documentRef, callback) {
  await documentRef.get().then(document => {
    console.log(
      "getFSDataByRef, collectionName: " +
        collectionName +
        ", documentId: " +
        documentRef.id
    );
    if (document.exists) {
      const fsData = document.data();
      const correspondingIdName = collectionName + "Id";
      fsData[correspondingIdName] = document.id;
      callback(fsData);
    } else {
      callback({});
    }
  });
}

export async function checkUserExist(userId) {
  await db
    .collection(LMCONST.Collection_User)
    .doc(userId)
    .get()
    .then(document => {
      if (document.exists) {
        throw new LMError(LMCONST.DataExist, {
          Message: "User exist in database already."
        });
      }
    });
}

export async function checkPaddingTime(req) {
  const SessionObj = req.body;
  const h = Logger.orgLogHeader(req.logPath, "check");
  Logger.log(`check Session : ${SessionObj.Title} time`, h);
  const ONE_HOUR = 60 * 60 * 1000;
  const startTime = SessionObj.StartTime;
  const endTime = SessionObj.EndTime;
  const locationId = SessionObj.LocationId;

  await getMulDataSimple(LMCONST.Collection_Session, 'LocationId', '==', locationId, (documents) => {
    documents.forEach(document => {
      let session
      convertFSDocToJSObj(LMCONST.Collection_LMSession, document, sessionJson => {
        session = sessionJson
      })
      if ((endTime - session.StartTime > 0 && endTime - session.StartTime < ONE_HOUR)
        || (session.EndTime - startTime > 0 && session.EndTime - startTime < ONE_HOUR)) {
        console.log(`session id : ${session.SessionRef.id}`)
        throw new LMError(LMCONST.DataRuleConflict, {
          Message: "Time overlap with other session"
        })
      }
    })
  })
}

//get document by document id
export async function getData(collectionName, documentId, callback) {
console.log('collectionName: '+collectionName+ ' documentId '+documentId)
  await db.collection(collectionName).doc(documentId).get()
    .then(document => {
      console.log("(getData) collectionName: " + collectionName + ", documentId: " + documentId)
      if (document.exists) {
        convertFSDocToJSObj(collectionName, document, callback)
      } else {
        console.warn(`${collectionName} document not found: ${documentId}`)
        const obj = {}
        obj[`${collectionName}Id`] = documentId
        obj["Target"] = `[${collectionName}] document`
        throw new LMError(LMCONST.NotFound, obj)
      }
    });
}

export async function getWholeData(collectionName, callback) {
	const returnArray = []
	await db.collection(collectionName).get()
	.then(documents => {
		console.log(`(getWholeData) collectionName: ${collectionName}, size: ${documents.size}`)
		if(documents.size > 0){
			documents.forEach(document => {
				convertFSDocToJSObj(collectionName, document, (jsonObject) => {
					returnArray.push(jsonObject)
				})
			});
			// for(const document of documents){
				// convertFSDocToJSObj(collectionName, document, (jsonObject) => {
					// returnArray.push(jsonObject)
				// })
			// }
		}
	})
	
	callback(returnArray);
}

//get document by document ref
export async function getDataByRef(collectionName, documentRef, callback) {
  if (documentRef.get === undefined) {
    callback({});
  }
  await documentRef.get().then(document => {
    console.log(
      "getDataByRef, collectionName: " +
        collectionName +
        ", documentId: " +
        documentRef.id
    );
    if (document.exists) {
      convertFSDocToJSObj(collectionName, document, callback);
    } else {
      callback({});
    }
  });
}

export async function getLastData(collectionName, order, callback) {
  await db.collection(collectionName).orderBy(order, "desc").limit(1).get()
    .then(querySnapshot => {
      console.log(`(getLastData) collectionName: ${collectionName}, order: ${order}`)
      console.log(`querySnapshot.size: `+querySnapshot.size)
      if (querySnapshot.size === 1) {
        callback(querySnapshot.docs[0])
      } else {
        callback(null)
      }
    })
}

export async function getLastDataSimple(collectionName,field,condition,callback) {
  await db.collection(collectionName).where(field, "==", condition).orderBy("CreatedAt", "desc")
    .limit(1)
    .get()
    .then(documents => {
      console.log(
        "(getLastDataSimple) collectionName: " +
          collectionName +
          ", field: " +
          field +
          ", condition: " +
          condition
      );
      callback(documents);
    });
}

export async function getWholeFSData(collectionName, callback) {
  await db.collection(collectionName).get()
    .then(documents => {
      console.log(`[getWholeFSData] collectionName: ${collectionName}`);
      callback(documents);
    });
}

export async function getMulDataSimple(collectionName,field,operator,condition,callback) {
  await db.collection(collectionName).where(field, operator, condition).get()
    .then(documents => {
      console.log(
        `[getMulDataSimple] collectionName: ${collectionName}, ${field} ${operator} ${condition}`
      );
      callback(documents);
    });
}

export async function getMulDataComplex(
  collectionName,
  fields,
  operators,
  conditions,
  callback
) {
  let collectionRef = db.collection(collectionName);
  console.log(`(getMulDataComplex) collectionName: ${collectionName}, `);
  for (let i = 0; i < fields.length; i++) {
    console.log(fields[i] + operators[i] + conditions[i]);
    collectionRef = collectionRef.where(fields[i], operators[i], conditions[i]);
  }

  await collectionRef.get().then(documents => {
    callback(documents);
  });
}

export async function updData(collectionName, documentId, dataObject) {
  await db
    .collection(collectionName)
    .doc(documentId)
    .update(dataObject);
}

export function batchAdd(collectionName, dataObject, returnObj, FsBatch) {
  // if(FsBatch === undefined){
  //   FsBatch = db.batch()
  // }
  const docRef = db.collection(collectionName).doc();
  returnObj.id = docRef.id;
  FsBatch.set(docRef, dataObject);
}

export function batchUpd(collectionName, documentId, dataObject, FsBatch) {
  // if(FsBatch === undefined){
  //   FsBatch = db.batch()
  // }
  const docRef = db.collection(collectionName).doc(documentId);
  FsBatch.update(docRef, dataObject);
}

export function batchDel(collectionName, documentId, dataObject, FsBatch) {
  // if(FsBatch === undefined){
  //   FsBatch = db.batch()
  // }
  const docRef = db.collection(collectionName).doc(documentId);
  FsBatch.delete(docRef, dataObject);
}

export async function batchCommit(FsBatch) {
  // if(FsBatch === undefined){
  //   return undefined
  // }
  await FsBatch.commit();
}

export async function addData(collectionName, dataObject, callback) {
  await db
    .collection(collectionName)
    .add(dataObject)
    .then(docRef => {
      callback(docRef.id);
    });
}

export async function addDataPlusChecking(collectionName, dataObject, callback) {
  const h = Logger.orgLogHeader(name, "addDataPlusChecking");

  //Check 1: if uniq key does not exist
  if (UK[collectionName] !== undefined) {
    const fields = UK[collectionName];
    const checkFields = [];
    const operators = [];
    const conditions = [];
    fields.forEach(field => {
      Logger.debug(`check field: ${field} start`, h);

      // separate xxxId and not xxxId
      if (field.includes("Id")) {
        const fieldCollectionName = field.split("Id")[0];
        checkFields.push(`${fieldCollectionName}Ref`);
        operators.push("==");
        conditions.push(getRef(fieldCollectionName, dataObject[field]));
      } else {
        checkFields.push(field);
        operators.push("==");
        conditions.push(dataObject[field]);
      }
      Logger.debug(`check field: ${field} end`, h);
    });
    await getMulDataComplex(collectionName,checkFields,operators,conditions, rtnArray => {
        if (rtnArray.size > 0) throw new LMError(LMCONST.UKConflict, {});
      }
    );
  }

  //Check 2: if foreign doc exist
  dataObject = changeIdToRef(dataObject);
  for (const key of Object.keys(dataObject)) {
    if (key.includes("Refs")) {
      for (const ref of dataObject[key]) {
        await checkDocExist(key, ref);
      }
    } else if (key.includes("Ref")) {
      await checkDocExist(key, dataObject[key]);
    }
  }

  await db
    .collection(collectionName)
    .add(dataObject)
    .then(docRef => {
      callback(docRef.id);
    });
}

async function checkDocExist(key, ref) {
  const h = Logger.orgLogHeader(name, "checkDocExist");

  Logger.debug(`collection : ${key.split("Ref")[0]}, document : ${ref.id}`, h);
  await ref.get().then(doc => {
    if (!doc.exists) {
      console.warn(`${key.split("Ref")[0]} document not found: ${ref.id}`);
      const obj = {};
      obj[`${key.split("Ref")[0]}Id`] = ref.id;
      obj["Target"] = `[${key.split("Ref")[0]}] document`;
      throw new LMError(LMCONST.NotFound, obj);
    }
  });
}

export async function addDataWithId(
  collectionName,
  documentId,
  dataObject,
  callback
) {
  await db
    .collection(collectionName)
    .doc(documentId)
    .set(dataObject)
    .then(() => {
      callback(documentId);
    });
}

export async function addDataWithSubCol(
  collectionName,
  dataObject,
  sucColName,
  subDocs,
  callback
) {
  let docId;
  const batch = db.batch();
  await db
    .collection(collectionName)
    .add(dataObject)
    .then(function(docRef) {
      console.log(
        "(addDataWithSubCol) collectionName: " +
          collectionName +
          ", sucColName: " +
          sucColName
      );
      if (subDocs !== undefined) {
        subDocs.forEach(function(subDoc) {
          const subDoctKey = sucColName + "Id";
          const subDocId = subDoc[subDoctKey];
          const newSubDoc = cloneObject(subDoc);
          delete newSubDoc.subDoctKey;
          const ref = db
            .collection(collectionName)
            .doc(docRef.id)
            .collection(sucColName)
            .doc(subDocId)
            .set(newSubDoc);
        });
      }
      docId = docRef.id;
    });
  await batch.commit();
  callback(docId);
}

function cloneObject(oldObj) {
  const newObj: any = {};
  for (const key of Object.keys(oldObj)) {
    newObj[key] = oldObj[key];
  }
  return newObj;
}

export function record(req) {
  const h = Logger.orgLogHeader(req.logPath, "record");
  Logger.log("uid: " + req.uid, h);
  Logger.log("API URL: " + req.method + req.originalUrl, h);
  const recordObj = {
    Operator: req.uid,
    OpeTime: new Date(),
    OpeAPI: req.method + req.originalUrl,
    Description: req.description
  };

  addData(LMCONST.Collection_Record, recordObj, docId => {
    Logger.log(`new record ${docId} added`, h);
  }).catch(error => {
    Logger.error(
      `Record failed, cause : ${error.message} uid: ${req.uid}, OpeAPI: ${
        recordObj.OpeAPI
      } `,
      h
    );
    //[TODO] should send email
  });
}

function toUserJSON(documentSnapshot) {
  return {
    UserRef: documentSnapshot.ref,
    Name: documentSnapshot.data().Name,
    Email: documentSnapshot.data().Email,
    Phone: documentSnapshot.data().Phone,
    ChefRef: documentSnapshot.data().ChefRef,
    HostRef: documentSnapshot.data().HostRef,
    IsFirstJoined: documentSnapshot.data().IsFirstJoin,
    ReferralCode: documentSnapshot.data().ReferralCode,
    InviterRef: documentSnapshot.data().InviterRef,
    Role: documentSnapshot.data().Role
  };
}

function toGeneralJSON(collectionName, document) {
	const returnJSON = {}
	returnJSON[collectionName+'Ref'] = document.ref	//document pk, will be converted as id later
	for (const key of Object.keys(document.data())) {
		if(document.data()[key] !== undefined){
			returnJSON[key] = document.data()[key]
			// console.log("key: "+key+": "+document.data()[key])
		}
	}
	return returnJSON
}

function toLMSessionJSON(documentSnapshot) {
  return {
    SessionRef: documentSnapshot.ref,
    Title: documentSnapshot.data().Title,
    LocationRef: documentSnapshot.data().LocationRef,
    StartTime: documentSnapshot.data().StartTime !== undefined
        ? documentSnapshot.data().StartTime._seconds * 1000
        : undefined,
    EndTime: documentSnapshot.data().EndTime !== undefined
        ? documentSnapshot.data().EndTime._seconds * 1000
        : undefined,
    Status: documentSnapshot.data().Status,
    PromotionRef: documentSnapshot.data().PromotionRef,
    OwnerRef: documentSnapshot.data().OwnerRef,
    Story: documentSnapshot.data().Story,
    Media: documentSnapshot.data().Media,
    Limit: documentSnapshot.data().Limit,
    Pax: documentSnapshot.data().Pax,
    BookedNumber: documentSnapshot.data().BookedNumber,
    SessionType: documentSnapshot.data().SessionType,
    Fee: documentSnapshot.data().Fee,
    Tag: documentSnapshot.data().Tag
  };
}

function toRQSessionJSON(documentSnapshot) {
  return {
    "SessionRef": documentSnapshot.ref,
    "SessionNumber": documentSnapshot.data().SessionNumber,
    "SessionType": documentSnapshot.data().SessionType,
    "StartTime": documentSnapshot.data().StartTime !== undefined ? documentSnapshot.data().StartTime._seconds * 1000 : undefined,
    "EndTime": documentSnapshot.data().EndTime !== undefined ? documentSnapshot.data().EndTime._seconds * 1000 : undefined,
    "Status": documentSnapshot.data().Status,
    "BudgetLow": documentSnapshot.data().BudgetLow,
    "BudgetHigh": documentSnapshot.data().BudgetHigh,
    "CompanyRef": documentSnapshot.data().CompanyRef,
    "LocationRef": documentSnapshot.data().LocationRef,
    "UserRef":documentSnapshot.data().UserRef
  }
}

export function convertFSDocToJSObj(collectionName, document, callback) {
  let returnJSON
  switch (collectionName) {
    case LMCONST.Collection_User:
      returnJSON = toUserJSON(document)
      break
    case LMCONST.Collection_LMSession:
      returnJSON = toLMSessionJSON(document)
      break
    case LMCONST.Collection_RQSession:
      returnJSON = toRQSessionJSON(document)
      break
		default:
			returnJSON = toGeneralJSON(collectionName, document)
	}

  if (returnJSON !== undefined) {
    callback(changeRefToId(returnJSON))
  } else {
    callback('no such collection')
  }
}

export function rangeFilter(rtnArray: any[], Query: any, field: string) {
  /*  [TODO]
  after refactor the flow how we get data from firestore, this should be change to 
  rtnArray.forEach(Json => {
      const target = Json[field]
      if(Query[field]['lt'] !== undefined && target >= Query[field]['lt']){
          ...
          ...
      }
  })
  */
  rtnArray.forEach(doc => {
      const target = doc.data()[field]._seconds * 1000;// this is only need for now
      if (Query[field]['lt'] !== undefined && target >= Query[field]['lt']) {
          const index = rtnArray.indexOf(doc);
          if (index > -1)
              rtnArray.splice(index, 1);
      }
      if (Query[field]['gt'] !== undefined && target <= Query[field]['gt']) {
          const index = rtnArray.indexOf(doc);
          if (index > -1)
              rtnArray.splice(index, 1);
      }
      if (Query[field]['lte'] !== undefined && target > Query[field]['lte']) {
          const index = rtnArray.indexOf(doc);
          if (index > -1)
              rtnArray.splice(index, 1);
      }
      if (Query[field]['gte'] !== undefined && target < Query[field]['gte']) {
          const index = rtnArray.indexOf(doc);
          if (index > -1)
              rtnArray.splice(index, 1);
      }
  });
}

export async function sleep(time: number): Promise<void> {
  return new Promise<void>((res, rej) => {
    setTimeout(res, time);
  });
}
