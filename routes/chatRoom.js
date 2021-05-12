const express = require("express");
const models = require("../models");
const router = express.Router();

router.get("/chatrooms", async (req, res, next) => {
  const chatRooms = await models.ChatRoom.findAll();
  res.send(chatRooms);
});
//@SBA
router.get("/:id", async (req, res) => {
  const chatRoom = await models.ChatRoom.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (chatRoom) {
    const name = chatRoom.name;
    res.send(name);
  }
  res.send("Error while getting the chatRoom");
});

router.post("/chatroom", async (req, res, next) => {
  const room = req.body.room;
  const chatRooms = await models.ChatRoom.findAll({
    where: { name: room },
  });
  const chatRoom = chatRooms[0];
  if (!chatRoom) {
    await models.ChatRoom.create({ name: room });
  }
  res.send(chatRooms);
});

router.get("/chatroom/messages/:chatRoomName", async (req, res, next) => {
  try {
    const chatRoomName = req.params.chatRoomName;
    const chatRooms = await models.ChatRoom.findAll({
      where: {
        name: chatRoomName,
      },
    });
    const chatRoomId = chatRooms[0].id;
    const messages = await models.ChatMessage.findAll({
      where: {
        chatRoomId,
      },
      order: [["createdAt", "ASC"]],
    });
    res.send(messages);
  } catch (error) {
    res.send([]);
  }
});

router.post("/chatroom/messages/delete", async (req, res, next) => {
  try {
    const chatRoomName = req.body.chatRoomName;
    const id = req.body.id;
    const chatRooms = await models.ChatRoom.findAll({
      where: {
        name: chatRoomName,
      },
    });
    const chatRoomId = chatRooms[0].id;
    await models.ChatMessage.destroy({
      where: {
        chatRoomId,
        id,
      },
    });
  } catch (error) {
    console.log(error);
    res.send([]);
  }
});

router.post("/chatroom/messages/reaction", async (req, res, next) => {
  try {
    const chatRoomName = req.body.chatRoomName;
    const id = req.body.id;
    const reactions = req.body.reactions;
    const chatRooms = await models.ChatRoom.findAll({
      where: {
        name: chatRoomName,
      },
    });
    const chatRoomId = chatRooms[0].id;
    await models.ChatMessage.update(
      { reactions: reactions },
      {
        where: {
          chatRoomId,
          id,
        },
      }
    );

    res.json({});
  } catch (error) {
    console.log(error);
    res.send([]);
  }
});

module.exports = router;
