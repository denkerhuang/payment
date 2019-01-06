//---- [Swagger parse]----
export const YamlFile = 'CE_2.0.yaml'
export const SwaggerRequest = 'request'
export const SwaggerResponse = 'response'

//---- [Firestore Code]----
export const Collection_User = 'User';
export const Collection_Session = 'Session';
export const Collection_Record = "Record";
export const Collection_Payment = "Payment";

//---- [Status]----
export const BookingStatus_Preview = 'preview'
export const BookingStatus_Booked = 'booked'
export const BookingStatus_Checkin = 'check-in'
export const BookingStatus_Cancelled = 'cancelled'
export const BookingStatus_Collected = 'ingredients-collected'
export const BookingStatus_Receipt = 'receipt-confirmed'
export const BookingStatus_Serving = 'serving'
export const BookingStatus_Pause = 'pause'
export const BookingStatus_Finish = 'finish'

export const ZoneSessionStatus_Close = 'close'

// export const DishStatus_Completed = 'completed'

export const OrderStatus_Preview = 'preview'
export const OrderStatus_Placed = 'placed'
// export const OrderStatus_Ready = 'ready'
export const OrderStatus_Completed = 'completed'

export const MissionStatus_Init = 'init'
export const MissionStatus_Ready = 'ready-deliver'
export const MissionStatus_Completed = 'completed'

export const SessionStatus_New = 'new'
export const SessionStatus_Open = 'open'
export const SessionStatus_Close = 'close'

export const SessionType_RQ = 'RQ'
export const SessionType_LM = 'LM'

export const BookingType_CE = 'CE'
export const BookingType_CK = 'CK'

export const Role_Admin = 'admin';
export const Role_Terminal = 'terminal';
export const Role_Foodie = 'foodie';
export const Role_Chef = 'chef';
export const Role_Consumer = 'consumer';
export const Role_Driver = 'driver';
export const Role_Contact = 'contact';

export const Datatype_String = 'string'
export const Datatype_Number = 'number'
export const Datatype_Integer = 'integer'
export const Datatype_Boolean = 'boolean'
export const Datatype_Array = 'array'
export const DataTypePromise = 'Promise'


//---- [Http Status & Error Code]----
export const HttpOK = '200'
export const BadRequest = '400'
export const Forbidden = '403'
export const TooManyRequests = '429'
export const ServerError = '500'

export const MalformatJSON = '100'
export const MissRequired = '101'
export const DataTypeError = '102'
export const Unauthorized = '200'

export const RequestFailed = '300'
export const FirestoreError = '301'
export const StripeError = '302'
export const SwaggerError = '303'

export const BookingStatusError = '310'
export const OrderStatusError = '311'
export const SessionStatusError = '312'
export const StationStatusError = '313'
export const NoRolePermission = '400'

export const NotFound = '404'

export const DataExist = '600'
export const DataRuleConflict = '601'
export const UKConflict = '602'
// export const ServerError = '500'
