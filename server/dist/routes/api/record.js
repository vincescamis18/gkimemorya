"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recordModel_1 = require("../../models/recordModel");
const commentModel_1 = require("../../models/commentModel");
const router = express_1.default.Router();
// @route   GET /api/records/
// @desc    Retrieve all record
// @access  Public
router.get("/", (req, res) => {
    recordModel_1.Record.find()
        .sort({ date: 1 })
        .then((item) => res.json(item));
});
// @route   GET /api/records/record-creator
// @desc    Retrieve all record with creator details
// @access  Public
router.get("/record-creator", (req, res) => {
    recordModel_1.Record.find()
        .populate("creator", ["surname", "given_name", "user_profile"])
        .sort({ date: 1 })
        .then((item) => res.json(item));
});
// @route   GET /api/records/record-creator
// @desc    Retrieve all record with creator details
// @access  Public
router.get("/record-creator/:_id", (req, res) => {
    const { _id } = req.params;
    recordModel_1.Record.findById(_id)
        .populate("creator", ["surname", "given_name", "user_profile"])
        .sort({ date: 1 })
        .then((item) => res.json(item));
});
// @route   GET /api/records/user/:id
// @desc    Retrieve all records of user by id
// @access  Public
router.get("/user/:creator", (req, res) => {
    recordModel_1.Record.find({ creator: req.params.creator })
        .then((item) => res.json(item))
        .catch((err) => res.json(err));
});
// @route   GET /api/records/record-creator/user/:id
// @desc    Retrieve all records of user by id with creator details
// @access  Public
router.get("/record-creator/user/:creator", (req, res) => {
    recordModel_1.Record.find({ creator: req.params.creator })
        .populate("creator", ["surname", "given_name", "user_profile"])
        .sort({ date: 1 })
        .then((item) => res.json(item))
        .catch((err) => res.json(err));
});
// @route   GET /api/records/record-count/user/:id
// @desc    Get the number of record posted by user
// @access  Public
router.get("/record-count/user/:creator", (req, res) => {
    recordModel_1.Record.find({ creator: req.params.creator })
        .then((item) => res.json({ count: item.length }))
        .catch((err) => res.json(err));
});
// @route   GET /api/records/:id
// @desc    Retrieve specific record by id
// @access  Public
router.get("/:_id", (req, res) => {
    recordModel_1.Record.findById(req.params._id)
        .then((item) => res.json(item))
        .catch((err) => res.json(err));
});
// @route   GET /api/records/search/
// @desc    Get all record with no search filter
// @access  Public
router.get("/search/title/", (req, res) => {
    const { word } = req.params;
    recordModel_1.Record.find()
        .sort({ date: 1 })
        .populate("creator", ["surname", "given_name", "user_profile"])
        .then((item) => res.json(item));
});
// @route   GET /api/records/search/:word
// @desc    Filter record by title
// @access  Public
router.get("/search/title/:word", (req, res) => {
    const { word } = req.params;
    recordModel_1.Record.find()
        .sort({ date: 1 })
        .populate("creator", ["surname", "given_name", "user_profile"])
        .then((item) => {
        // filter the title that has the search word on it
        const filteredRecord = [];
        item.forEach(item => {
            if (item.title.toLocaleLowerCase().includes(word.toLocaleLowerCase()))
                filteredRecord.push(item);
        });
        res.json(filteredRecord);
    });
});
// @route   GET /api/records/filter/location/:word
// @desc    Filter record by location
// @access  Public
router.get("/filter/location/:word", (req, res) => {
    const { word } = req.params;
    console.log("Filter record by location", word);
    if (!word)
        return res.json({ err: "Missing field" });
    recordModel_1.Record.find()
        .sort({ date: 1 })
        .populate("creator", ["surname", "given_name", "user_profile"])
        .then((item) => {
        // filter the title that has the search word on it
        const filteredRecord = [];
        item.forEach(item => {
            if (item.address.toLocaleLowerCase().includes(word.toLocaleLowerCase()))
                filteredRecord.push(item);
        });
        res.json(filteredRecord);
    })
        .catch((err) => res.json(err));
});
// @route   GET /api/records/filter/date-start/:date
// @desc    Filter record by startDate and endDate
// @access  Public
router.get("/filter/date/:startDate/:endDate", (req, res) => {
    const { startDate, endDate } = req.params;
    console.log("Filter record by startDate and endDate", startDate, endDate);
    if (!startDate || !endDate)
        return res.json({ err: "Missing field" });
    recordModel_1.Record.find({ date: { $gte: startDate, $lte: endDate } })
        .sort({ date: 1 })
        .populate("creator", ["surname", "given_name", "user_profile"])
        .then((featuredMemory) => res.json(featuredMemory))
        .catch((err) => res.json(err));
});
// @route   GET /api/records/filter/tag/:word
// @desc    Filter record by tag
// @access  Public
router.get("/filter/tag/:word", (req, res) => {
    const { word } = req.params;
    console.log("Filter record by tag", word);
    if (!word)
        return res.json({ err: "Missing field" });
    recordModel_1.Record.find()
        .sort({ date: 1 })
        .populate("creator", ["surname", "given_name", "user_profile"])
        .then((item) => {
        // filter the title that has the search word on it
        const filteredRecord = [];
        item.forEach(item => {
            if (item.tag.toLocaleLowerCase().includes(word.toLocaleLowerCase()))
                filteredRecord.push(item);
        });
        res.json(filteredRecord);
    })
        .catch((err) => res.json(err));
});
// @route   GET /api/records/filter/description/:word
// @desc    Filter record by description
// @access  Public
router.get("/filter/description/:word", (req, res) => {
    const { word } = req.params;
    console.log("Filter record by description", word);
    if (!word)
        return res.json({ err: "Missing field" });
    recordModel_1.Record.find()
        .sort({ date: 1 })
        .populate("creator", ["surname", "given_name", "user_profile"])
        .then((item) => {
        // filter the title that has the search word on it
        const filteredRecord = [];
        item.forEach(item => {
            if (item.description.toLocaleLowerCase().includes(word.toLocaleLowerCase()))
                filteredRecord.push(item);
        });
        res.json(filteredRecord);
    })
        .catch((err) => res.json(err));
});
// @route   GET /api/records/filter-multiple
// @desc    Filter record by all fields
// @access  Public
router.post("/filter-multiple/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, tag, location, startDate, endDate } = req.body;
    console.log("filter-multiple", req.body);
    recordModel_1.Record.find()
        .sort({ date: 1 })
        .populate("creator", ["surname", "given_name", "user_profile"])
        .then((item) => {
        if (!title && !description && !tag && !location && !startDate && !endDate)
            return res.json(item);
        let combinedFilter = [];
        const filteredTitle = [];
        const filteredDescription = [];
        const filteredLocation = [];
        const filteredTag = [];
        item.forEach(item => {
            // retrieve filtered record by field
            if (title && item.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()))
                filteredTitle.push(item);
            if (description && item.description.toLocaleLowerCase().includes(description.toLocaleLowerCase()))
                filteredDescription.push(item);
            if (location && item.address.toLocaleLowerCase().includes(location.toLocaleLowerCase()))
                filteredLocation.push(item);
            if (tag && item.tag.toLocaleLowerCase().includes(tag.toLocaleLowerCase()))
                filteredTag.push(item);
        });
        // intial combinedFilter values
        if (title)
            combinedFilter = filteredTitle;
        else if (description)
            combinedFilter = filteredDescription;
        else if (location)
            combinedFilter = filteredLocation;
        else if (tag)
            combinedFilter = filteredTag;
        if (description) {
            // combine the description to filter
            let combinedFilterTemp = [];
            combinedFilter.forEach((combinedRecord) => {
                if (filteredDescription.find((record) => record._id == combinedRecord._id))
                    combinedFilterTemp.push(combinedRecord);
            });
            combinedFilter = combinedFilterTemp;
        }
        if (location) {
            // combine the location to filter
            let combinedFilterTemp = [];
            combinedFilter.forEach((combinedRecord) => {
                if (filteredLocation.find((record) => record._id == combinedRecord._id))
                    combinedFilterTemp.push(combinedRecord);
            });
            combinedFilter = combinedFilterTemp;
        }
        if (tag) {
            // combine the tag to filter
            let combinedFilterTemp = [];
            combinedFilter.forEach((combinedRecord) => {
                if (filteredTag.find((record) => record._id == combinedRecord._id))
                    combinedFilterTemp.push(combinedRecord);
            });
            combinedFilter = combinedFilterTemp;
        }
        if (startDate && endDate) {
            // combine the date to filter
            recordModel_1.Record.find({ date: { $gte: startDate, $lte: endDate } })
                .sort({ date: 1 })
                .populate("creator", ["surname", "given_name", "user_profile"])
                .then((filteredDate) => {
                let combinedFilterTemp = [];
                combinedFilter.forEach((combinedRecord) => {
                    if (filteredDate.find((record) => `${record._id}` == `${combinedRecord._id}`))
                        combinedFilterTemp.push(combinedRecord);
                });
                combinedFilter = combinedFilterTemp;
                return res.json(combinedFilter);
            })
                .catch((err) => res.json(err));
        }
        else
            return res.json(combinedFilter);
    })
        .catch((err) => res.json(err));
}));
// @route   POST /api/records/
// @desc    Create new record
// @access  Public
router.post("/", (req, res) => {
    console.log(req.body);
    // create a new record instance
    const newRecord = new recordModel_1.Record(req.body);
    newRecord
        .save()
        .then((record) => {
        // create a comment section instance
        const newComment = new commentModel_1.Comment({ record_id: record._id, comments: [] });
        newComment
            .save()
            .then(() => res.json(record))
            .catch((err) => res.json(err));
    })
        .catch((err) => res.json(err));
});
// @route   PUT /api/records/
// @desc    Update record by _id
// @access  Public
router.put("/", (req, res) => {
    const { updItem, _id } = req.body;
    recordModel_1.Record.updateOne({ _id }, { $set: updItem })
        .then((updItem) => res.json(updItem))
        .catch((err) => res.json({ err }));
});
// @route   DELETE /api/records/
// @desc    Delete record by _id
// @access  Public
router.delete("/:_id", (req, res) => {
    recordModel_1.Record.deleteOne({ _id: req.params._id })
        .then(() => res.json({ msg: "Deleted successfully" }))
        .catch((err) => res.json({ err }));
});
module.exports = router;
