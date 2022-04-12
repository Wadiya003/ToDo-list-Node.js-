const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const { INSPECT_MAX_BYTES } = require("buffer");
const mongoose = require("mongoose");
const _=require("lodash");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// let items =[];
// let workItems=[];
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});
const todoSchema = {
  name: String,
};
const todolist = mongoose.model("todolist", todoSchema);

const demo1 = new todolist({
  name: "Welcome to your to do list!",
});
const demo2 = new todolist({
  name: "Hit + to add in your list.",
});
const demo3 = new todolist({
  name: "Hit - to delete an item from list.",
});
const defaultitem = [demo1, demo2, demo3];

const Listschema = {
  name: String,
  items: [todoSchema],
};
const List = mongoose.model("List", Listschema);


app.get("/", function (req, res) {
 
  todolist.find({}, function (err, found) {
    if (found.length === 0) {
      todolist.insertMany(defaultitem, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully added the default items!");
        }
      });
      res.redirect("/");
    }
    // console.log(found);
    else {
      res.render("list", {
        listTitle: "Today",
        newListItems: found,
      });
    }
  });
});



// app.post("/", function (req, res) {
//   const itemName = req.body.newItem;
//   const listname = req.body.list;
//   const item = new todolist({
//     name: itemName,
//   });
//   if (listname === "Today") {
//     item.save();
//     res.redirect("/");
//   } else {
//     List.findOne({ name: listname }, function (err, foundlist) {
//       foundlist.items.push(item);
//       foundlist.save();
//       res.redirect("/" + listname);
//     });
//   }
// });

// app.get("/:customList", function (req, res) {
//  const customList = _.capitalize(req.params.customList);
//   console.log(customList);
//   List.findOne({ name: customList }, function (err, found) {
//     if (!err) {
//       if (!found) {
//         console.log("Doesn't exists but will make one!");
//         const list = new List({
//           name: customList,
//           items: defaultitem,
//         });
//         list.save();
//         res.redirect("/" + customList);
//       } else {
//         console.log("Successfully Added to already existing Custom list!");
//         res.render("list", {
//           listTitle: found.name,
//           newListItems: found.items,
//         });
//       }
//     }
//   });
// });

app.post("/additem", function (req, res) {
  const itemName = req.body.newItem;
  const listname = req.body.list;
  const item = new todolist({
    name: itemName,
  });
  if (listname === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listname }, function (err, foundlist) {
      foundlist.items.push(item);
      foundlist.save();
      res.redirect("/" + listname);
    });
  }
});


app.post("/addlist",function(req,res){
  const customList = _.capitalize(req.body.newlist);
  List.findOne({ name: customList }, function (err, found) {
    if (!err) {
      if (!found) {
        console.log("Doesn't exists but will make one!");
        const list = new List({
          name: customList,
          items: defaultitem,
        });
        list.save();
        res.redirect("/" + customList);
      } else {
        console.log("Successfully Added to already existing Custom list!");
        res.render("list", {
          listTitle: found.name,
          newListItems: found.items,
        });
      }
    }
  });
})

app.get("/:customList",function(req,res){
  const customList = _.capitalize(req.params.customList);
  List.findOne({ name: customList }, function (err, found) {
    if(!err){
  res.render("list", {
    listTitle: found.name,
    newListItems: found.items, 
  });
}
});
});

app.post("/delete", function (req, res) {
  const selected = req.body.checkbox;
  const listName= req.body.listname;
  if(listName==="Today"){
  todolist.findByIdAndRemove(selected,function(err){
      if (!err) {
      console.log("Deleted from Today list.");
      res.redirect("/");
  };
});
}  else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:selected}}},function(err,found){
    if(!err){
      res.redirect("/"+listName);
      console.log("Deleted from custom list.")
    }
  });
  };
});

// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

// var current = today.getDay();
//   var day = "";
//   switch (current) {
//     case 0:
//       day = "Sunday";
//       break;
//     case 1:
//       day = "Monday";
//       break;
//     case 2:
//       day = "Tuesday";
//       break;
//     case 3:
//       day = "Wednesday";
//       break;
//     case 4:
//       day = "Thursday";
//       break;
//     case 5:
//       day = "Friday";
//       break;
//     case 6:
//       day = "Saturday";
//       break;
//     default:
//     console.log("error");
//       break;
//   }

//   res.render("list", { Whichday: day });

app.listen(3000, function () {
  console.log("Server running at port 3000");
});
