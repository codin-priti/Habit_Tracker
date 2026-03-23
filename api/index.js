const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(
'mongodb+srv://pritipaul:Habit123@cluster0.ijh2afe.mongodb.net/habit')
.then(() => {
  console.log('MongoDB Connected Successfully ');
})
.catch((error) => {
  console.error('MongoDB Connection Error ', error);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const Habit = require("./models/habit");

app.post("/habits",async (req,res) => {
  try{
    const {title,color,days,repeatMode,mood,reminder} = req.body;

    const habit = new Habit({
      title,
      color,
      days,
      mood,
      repeatMode,
      reminder
    });

    const savedHabit = await habit.save();
    res.status(201).json(savedHabit);

  }catch(error){
    res.status(500).json({message:"Error creating habit",error:error.message})
  }
})

app.get("/habitslist",async (req,res) => {
  try{
    const allHabits = await Habit.find({});
    res.status(200).json(allHabits);
  }catch(error){
    res.status(500).json({message:"Error fetching habits",error:error.message});

  }

}
)

app.put("/habits/:habitId/completed",async (req,res) => {
  const habitId = req.params.habitId;
  const updatedCompletion = req.body.completed;

  try{
    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      { completed: updatedCompletion },
      { new: true }
    );
    if(!updatedHabit){
      return res.status(404).json({message:"Habit not found"});
    }

    return res.status(200).json(updatedHabit);
  }catch(error){
    return res.status(500).json({message:"Error updating habit completion",error:error.message});
  }
});

app.delete("/habits/:habitId",async (req,res) => {
  try{
    const {habitId} = req.params;

    await Habit.findByIdAndDelete(habitId);
        res.status(200).json({ message: "Habit deleted succusfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete the habit" });
  }
});

  