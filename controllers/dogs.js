import { Dog } from '../models/dog.js'
import { Profile } from '../models/profile.js'
// import { User } from '../models/user.js'

import { v2 as cloudinary } from 'cloudinary'

/* ------------------ DOG ------------------ */
//* Get/Indexing Functions

async function index(req, res) {
    try {
      const currentDog = await Dog.find({})
      console.log(currentDog, 'currentDog')
      res.status(200).json(currentDog)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
  // Dog.findById(req.params.id)
  // .then(dog => {
  //   if (!dog) {
  //     throw new Error('Dog not found')
  //   }
  //   Profile.findById(dog.owner)
  //     .then(profile => {
  //       console.log('profile found in show', profile)
  //       if (profile){
  //         // console.log('dog found', dog)
  //         // console.log('onwer', dog.owner)
  //         return res.status(200).json(dog)
  //       }
  //     })
  // User.findById(req.params.id)
  //   .then(user => {
  //     console.log('user found', user)

  // Dog.find({})
  //   .then(dog => {
  //     console.log('dog found', dog)
  //     if (!dog) {
  //       throw new Error('Dog not found')
  //     }
  //     Profile.findById(dog.owner)
  //       .then(profile => {
  //         console.log('profile found in index', profile)
  //         if (profile) {
  //           // console.log('dog found', dog)
  //           // console.log('onwer', dog.owner)
  //           return res.status(200).json([...dog])
  //         }
  //       })
  //       .catch(err => {
  //         console.error("Error: ", err)
  //         res.status(500).json(err)
  //       })
  //   })
  //   .catch(err => {
  //     console.error("Error: ", err)
  //     res.status(500).json(err)
  //   })
// }

//* Get/Show Functions

async function show(req, res) {
  // try {
  //   const dog = await Dog.findById(req.params.id)
  //   console.log(dog)
  //   res.status(200).json(dog, "dog in show")
  // } catch (err) {
  //   console.log(err)
  //   res.status(500).json(err)
  // }
  // Profile.findById(req.user.id)
  //   .then(profile => {
  //     console.log('profile found in show', req.user.profile)
  //     Dog.findById(req.params.id)
  //       .then(dog => {
  //         if (!dog) {
  //           throw new Error('Dog not found')
  //         } else if ([...dog.owner].includes(profile._id) === false ||
  //           profile.dogs.includes(dog._id) === false) {
  //           res.status(401).json({ message: 'Unauthorized' })
  //         } else {
  //           console.log('dog found', dog)
  //           res.status(200).json(dog)
  //         }
  //       })
  //   })
    Dog.findById(req.params.id)
      .then(dog => {
        if (!dog) {
          throw new Error('Dog not found')
        }
        Profile.findById(dog.owner)
          .then(profile => {
            console.log('profile found in show', profile)
            if (profile){
              // console.log('dog found', dog)
              // console.log('onwer', dog.owner)
              return res.status(200).json(dog)
            }
          })
          .catch(err => {
            console.error("Error: ", err)
            res.status(500).json(err)
          })
      })
      .catch(err => {
        console.error("Error: ", err)
        res.status(500).json(err)
      })
}

//* Post/Create Functions

function create(req, res) {
  console.log('dog created', req.body)
  Dog.create(req.body)
    .then(dog => {
      console.log('profile found', req.user.profile)
      Profile.findById(req.user.profile)
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

//* Put/Update Functions

async function update(req, res) {
  try {
    const updatedDog = await Dog.findByIdAndUpdate(
      req.params.id,       // The ID of the document to update
      req.body,            // The update data
      { new: true }        // Options: return the updated document
    );
    console.log(updatedDog, 'updatedDog')

    if (!updatedDog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    res.status(200).json(updatedDog);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
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
    Dog.findById(dogId)
      .then(dog => {
        if (!dog) {
          return res.status(404).json({ message: 'Dog not found' });
        }
        // Add new walk data to walking array
        dog.walking.push(walkData)

        // Save the updated dog
        dog.save();
        res.status(201).json(dog);
      })
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}


const updateWalk = async (req, res) => {
  // find dog
  console.log('profile found in updatewalk', req.user.profile)
  Dog.findById(req.params.id)
    .then(dog => {
      if (!dog) {
        throw new Error('Dog not found')
      } else {
        dog.walking.push(req.body)
        dog.save();
        res.status(200).json(dog);
      }
    })


    // find walk
    // const walk = dog.walking.id(walkId);
    // if (!walk) {
    //   return res.status(404).json({ message: 'Walk not found' })
    // }

    // update walk data
    // walk.frequency = walkData.frequency;
    // walk.walkTimes = walkData.walkTimes;

    // // save updated dog
    // await dog.save();

    // res.status(200).json(dog);
    .catch(err => {
      console.error("Error: ", err)
      res.status(500).json(err)
    })
}
// }


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
  // indexWalks,
  createWalk,
  updateWalk,
  deleteWalk,
  deleteDogProfile
}
