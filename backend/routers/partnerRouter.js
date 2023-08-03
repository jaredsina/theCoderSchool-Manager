const partnerRouter = require("express").Router();
const partnerController = require("../controllers/partnerController");

partnerRouter.get("/", partnerController.getPartners);
partnerRouter.post("/", partnerController.createPartner);
partnerRouter.put("/:id", partnerController.replacePartner);
partnerRouter.patch("/:id", partnerController.updatePartner);
partnerRouter.delete("/:id", partnerController.deletePartner);

module.exports = partnerRouter;
