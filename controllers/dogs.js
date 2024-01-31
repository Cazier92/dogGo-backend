import { Dog } from '../models/dog.js'
import { Profile } from '../models/profile.js'
import { v2 as cloudinary } from 'cloudinary'

/* ------------------ DOG ------------------ */
//* Get/Indexing Functions

async function index(req, res) {
  try {
    const dogs = await Dog.find({})
    res.json(dogs)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

//* Get/Show Functions

async function show(req, res) {
  try {
    const dog = await Dog.findById(req.params.id)
    res.json(dog)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

//* Post/Create Functions

function create(req, res) {
  Dog.create(req.body)
  console.log('dog created', req.body)
    .then(dog => {
      Profile.findById(req.user.profile)
      console.log('profile found', req.user.profile)
        .then(profile => {
          profile.dogs.push(dog)
          profile.save()
          dog.owner.push(profile.id)
          dog.save()
          res.status(201).json(dog)
        })
    })
    .catch(err => {
      console.error("Error: ", err)
      res.status(500).json(err)
    })
}

//   try {
//     // req.body.owner = req.user.profile;
//     const dog = await Dog.create(req.body);
//     const profile = await Profile.findByIdAndUpdate(
//       req.user.profile.id,
//       { $push: { dogs: dog } },
//       { new: true }
//     );
//     dog.owner.push(profile.id);

//     res.status(201).json(dog);
//   } catch (err) {
//     res.status(500).json({ err: err.message })
//   }
// };


//* Put/Update Functions

async function update(req, res) {
  try {
    const dog = await Dog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    await dog.save()
    res.status(200).json(dog)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}


async function addPhoto(req, res) {
  try {
    const imageFile = req.files.photo.path
    const dog = await Dog.findById(req.params.id)

    const image = await cloudinary.uploader.upload(
      imageFile,
      { tags: `${req.user.email}` }
    )
    dog.photo = image.url

    await dog.save()
    res.status(201).json(dog.photo)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}


//* Delete Functions

async function deleteDogProfile(req, res) {
  try {
    const dogId = req.params.id;
    const dog = await Dog.findById(dogId);
    const profile = await Profile.findById(req.user.profile);
    if (profile.dogs.includes(dogId) === false) {
      return res.status(404).json({ message: 'Dog not found' })
    }
    // Dog.findByIdAndDelete(dogId);
    profile.dogs.remove(dogId);
    await profile.save();
    res.status(200).json({ message: 'Dog Profile successfully removed' })

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

/* ------------------ WALK ------------------ */

const createWalk = async (req, res) => {
  try {
    const dogId = req.params.id;
    const walkData = req.body;

    // Find dog by ID
    const dog = await Dog.findById(dogId);

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    // Create new walk w/ walkData
    const newWalk = {
      frequency: walkData.frequency,
      walkTimes: walkData.walkTimes
    }

    // Add new walk to walking array
    dog.walking.push(newWalk);

    // Save the updated dog
    await dog.save();

    res.status(201).json(dog);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const updateWalk = async (req, res) => {
  try {

    const dogId = req.params.id;
    const walkId = req.params.walkId;
    const walkData = req.body;
    // find dog
    const dog = await Dog.findById(dogId);
    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' })
    }

    // find walk
    const walk = dog.walking.id(walkId);
    if (!walk) {
      return res.status(404).json({ message: 'Walk not found' })
    }

    // update walk data
    walk.frequency = walkData.frequency;
    walk.walkTimes = walkData.walkTimes;

    // save updated dog
    await dog.save();

    res.status(200).json(dog);
  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
}


const deleteWalk = async (req, res) => {
  try {
    const dogId = req.params.id;
    const walkId = req.params.walkId

    const dog = await Dog.findById(dogId);
    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' })
    }

    const walk = dog.walking.id(walkId);
    if (!walk) {
      return res.status(404).json({ message: 'Walk not found' })
    }

    walk.remove();
    await dog.save();

    res.status(200).json({ message: 'Walk deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};


export {
  index,
  show,
  update,
  addPhoto,
  create,
  createWalk,
  updateWalk,
  deleteWalk,
  deleteDogProfile
}
