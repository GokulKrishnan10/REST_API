const { Router, response } = require("express");
const express = require("express");
const subscriber = require("../models/subscriber");
const router = express.Router();
const Subscriber = require("../models/subscriber");

//GETTING ALL
router.get("/", async (request, response) => {
  try {
    const subscribers = await Subscriber.find();
    response.json(subscribers);
  } catch (error) {
    response.send(500).json({ message: error.message });
  }
});

//GETTING ONE
router.get("/:id", getSubscriber, (request, response) => {
  response.json(response.subscriber);
});

//CRETING one
router.post("/", async (request, response) => {
  const subscriber = new Subscriber({
    name: request.body.name,
    subscribedToChannel: request.body.subscribedToChannel,
  });
  try {
    const newSubscriber = await subscriber.save();
    response.status(201).json(newSubscriber);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});
//UPDATING ONE
router.patch("/:id", getSubscriber, async (request, response) => {
  if (request.body.name != null) {
    response.subscriber.name = request.body.name;
  }
  if (request.body.subscribedToChannel != null) {
    response.subscriber.subscribedToChannel = request.body.subscribedToChannel;
  }
  try {
    const updatedSubscriber = await response.subscriber.save();
    response.json(updatedSubscriber);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});
//DELETING ONE
router.delete("/:id", getSubscriber, async (request, response) => {
  try {
    await response.subscriber.remove();
    response.json({ message: "Deleted Subscriber" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});
async function getSubscriber(request, response, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(request.params.id);
    if (subscriber == null) {
      return response.status(404).json({ message: "Cannnot Find Subscriber" });
    }
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
  response.subscriber = subscriber;
  next();
}
module.exports = router;
