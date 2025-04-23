/*
 Navicat Premium Data Transfer

 Source Server         : mongolocal
 Source Server Type    : MongoDB
 Source Server Version : 80006 (8.0.6)
 Source Host           : localhost:27017
 Source Schema         : ChatDB

 Target Server Type    : MongoDB
 Target Server Version : 80006 (8.0.6)
 File Encoding         : 65001

 Date: 24/04/2025 00:06:58
*/


// ----------------------------
// Collection structure for messages
// ----------------------------
db.getCollection("messages").drop();
db.createCollection("messages",{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "sender",
                "receiver",
                "is_group",
                "content_type",
                "timestamp",
                "status"
            ],
            properties: {
                sender: {
                    bsonType: "string",
                    description: "Số điện thoại hoặc ID người gửi"
                },
                receiver: {
                    bsonType: "string",
                    description: "Số điện thoại hoặc ID người nhận (hoặc group ID nếu is_group = true)"
                },
                is_group: {
                    bsonType: "bool",
                    description: "true nếu là tin nhắn nhóm"
                },
                content_type: {
                    bsonType: "string",
                    enum: [
                        "text",
                        "image",
                        "file",
                        "video",
                        "video_call_signal"
                    ],
                    description: "Loại nội dung tin nhắn"
                },
                timestamp: {
                    bsonType: "date",
                    description: "Thời gian gửi tin nhắn"
                },
                status: {
                    bsonType: "string",
                    enum: [
                        "sent",
                        "delivered",
                        "read"
                    ],
                    description: "Trạng thái tin nhắn"
                },
                url_file: {
                    bsonType: "string"
                },
                name_file: {
                    bsonType: "string"
                },
                size_file: {
                    bsonType: "string"
                },
                mime_type_file: {
                    bsonType: "string"
                },
                duration_video: {
                    bsonType: "string"
                },
                text: {
                    bsonType: "string"
                },
                type_video_call: {
                    bsonType: "string",
                    enum: [
                        "offer",
                        "answer",
                        "ice-candidate"
                    ]
                },
                sdp: {
                    bsonType: "string",
                    description: "Chuỗi SDP mô tả cuộc gọi"
                },
                candidate: {
                    bsonType: "string",
                    description: "Chuỗi mô tả ICE candidate"
                },
                sdpMid: {
                    bsonType: "string",
                    description: "Loại media (audio hoặc video)"
                },
                sdpMLineIndex: {
                    bsonType: "string",
                    description: "Chỉ mục dòng trong SDP"
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});
db.getCollection("messages").createIndex({
    "$**": "text"
}, {
    name: "message_get",
    weights: {
        receiver: NumberInt("1"),
        sender: NumberInt("1"),
        timestamp: NumberInt("1")
    },
    default_language: "english",
    language_override: "language",
    textIndexVersion: NumberInt("3")
});
db.getCollection("messages").createIndex({
    sender: NumberInt("1"),
    receiver: NumberInt("1"),
    timestamp: NumberInt("1")
}, {
    name: "sender_1_receiver_1_timestamp_1",
    background: true
});
db.getCollection("messages").createIndex({
    is_group: NumberInt("1")
}, {
    name: "is_group_1",
    background: true
});
db.getCollection("messages").createIndex({
    content_type: NumberInt("1")
}, {
    name: "content_type_1",
    background: true
});

// ----------------------------
// Documents of messages
// ----------------------------
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b200fd37e25092f389f8"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "1",
    timestamp: ISODate("2025-04-22T15:13:04.199Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b203fd37e25092f389fa"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "12",
    timestamp: ISODate("2025-04-22T15:13:07.696Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b20ffd37e25092f389fc"),
    sender: "0333657670",
    receiver: "03351288670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "123",
    timestamp: ISODate("2025-04-22T15:13:19.455Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b212fd37e25092f389fe"),
    sender: "0333657670",
    receiver: "03351288670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "1234",
    timestamp: ISODate("2025-04-22T15:13:22.637Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b24cfd37e25092f38a00"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "image",
    status: "sent",
    url_file: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    name_file: "example_file.image",
    size_file: "1024",
    mime_type_file: "application/pdf",
    duration_video: "0",
    timestamp: ISODate("2025-04-22T15:14:20.808Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b24ffd37e25092f38a02"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "image",
    status: "sent",
    url_file: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    name_file: "example_file.image",
    size_file: "1024",
    mime_type_file: "application/pdf",
    duration_video: "0",
    timestamp: ISODate("2025-04-22T15:14:23.554Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b258fd37e25092f38a04"),
    sender: "0333657670",
    receiver: "03351288670",
    is_group: false,
    content_type: "image",
    status: "sent",
    url_file: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    name_file: "example_file.image",
    size_file: "1024",
    mime_type_file: "application/pdf",
    duration_video: "0",
    timestamp: ISODate("2025-04-22T15:14:32.781Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b261fd37e25092f38a06"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "image",
    status: "sent",
    url_file: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    name_file: "example_file.image",
    size_file: "1024",
    mime_type_file: "application/pdf",
    duration_video: "0",
    timestamp: ISODate("2025-04-22T15:14:41.999Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b27cfd37e25092f38a08"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "123431",
    url_file: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    name_file: "example_file.image",
    size_file: "1024",
    mime_type_file: "application/pdf",
    duration_video: "0",
    timestamp: ISODate("2025-04-22T15:15:08.766Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b27dfd37e25092f38a0a"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "123431",
    url_file: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    name_file: "example_file.image",
    size_file: "1024",
    mime_type_file: "application/pdf",
    duration_video: "0",
    timestamp: ISODate("2025-04-22T15:15:09.942Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b285fd37e25092f38a0c"),
    sender: "0333657670",
    receiver: "03351288670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "123312431",
    url_file: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    name_file: "example_file.image",
    size_file: "1024",
    mime_type_file: "application/pdf",
    duration_video: "0",
    timestamp: ISODate("2025-04-22T15:15:17.101Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6807b28afd37e25092f38a0e"),
    sender: "0333657670",
    receiver: "03351288670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "hihi",
    url_file: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    name_file: "example_file.image",
    size_file: "1024",
    mime_type_file: "application/pdf",
    duration_video: "0",
    timestamp: ISODate("2025-04-22T15:15:22.469Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("680917ec70b3fdfe02a8522c"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "hrhr",
    timestamp: ISODate("2025-04-23T16:40:12.241Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("680917fa70b3fdfe02a8522f"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "😚 rep đi",
    timestamp: ISODate("2025-04-23T16:40:26.59Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6809183070b3fdfe02a85232"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "test lại",
    timestamp: ISODate("2025-04-23T16:41:20.394Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6809186770b3fdfe02a85235"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "okok",
    timestamp: ISODate("2025-04-23T16:42:15.028Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("6809188970b3fdfe02a85238"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "text",
    status: "sent",
    text: "dmack",
    timestamp: ISODate("2025-04-23T16:42:49.075Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("680918b470b3fdfe02a8523b"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "image",
    status: "sent",
    text: "đáa",
    timestamp: ISODate("2025-04-23T16:43:32.08Z"),
    __v: NumberInt("0"),
    name_file: "anh.jpg",
    url_file: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdIQNtM1KoFuSyzeXiwcCX8ZHPvufDU1WcHQ&s"
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("68091d7489b73711d36c7fa8"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "image",
    status: "sent",
    url_file: "https://firebasestorage.googleapis.com/v0/b/uploadingfile-4ee57.appspot.com/o/images%2F55ad26d3-19ec-41c9-8e74-00d1d1df9bf1_image.png?alt=media&token=ec2194cf-2b4c-4c7d-aea7-29c678735bf2",
    name_file: "image.png",
    size_file: "122680",
    mime_type_file: "image/png",
    duration_video: "0",
    timestamp: ISODate("2025-04-23T17:03:48.934Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("messages").insert([ {
    _id: ObjectId("68091dbe89b73711d36c7fae"),
    sender: "03351288670",
    receiver: "0333657670",
    is_group: false,
    content_type: "image",
    status: "sent",
    url_file: "https://firebasestorage.googleapis.com/v0/b/uploadingfile-4ee57.appspot.com/o/images%2F5f305aee-af42-4302-bff9-8111f407e03b_image.png?alt=media&token=0f0c7058-be9c-4b2e-841d-b7ddaa812d31",
    name_file: "image.png",
    size_file: "35801",
    mime_type_file: "image/png",
    duration_video: "0",
    timestamp: ISODate("2025-04-23T17:05:02.852Z"),
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for notifications
// ----------------------------
db.getCollection("notifications").drop();
db.createCollection("notifications",{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "type",
                "sender",
                "receiver",
                "timestamp",
                "status"
            ],
            properties: {
                type: {
                    bsonType: "string",
                    enum: [
                        "friend_request",
                        "friend_accept",
                        "friend_remove",
                        "message"
                    ],
                    description: "Loại thông báo: lời mời kết bạn, chấp nhận kết bạn, huỷ kết bạn, hoặc thông báo tin nhắn mới"
                },
                sender: {
                    bsonType: "string",
                    description: "ID người gửi thông báo"
                },
                receiver: {
                    bsonType: "string",
                    description: "ID người nhận thông báo"
                },
                timestamp: {
                    bsonType: "date",
                    description: "Thời điểm tạo thông báo"
                },
                status: {
                    bsonType: "string",
                    enum: [
                        "unread",
                        "read"
                    ],
                    description: "Trạng thái thông báo"
                }
            }
        }
    }
});

// ----------------------------
// Documents of notifications
// ----------------------------
