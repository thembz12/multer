const { signUp, getOne, getAll, updateUser, deleteUser } = require("../userController/userController")
const upload = require("../utils/multer")
const router = require ("express").Router()


router.post("/signup", upload.array("images", 5), signUp)
router.get('/one/:id', getOne)

router.get('/all', getAll)

router.put('/update/:id', upload.single('image'), updateUser)

router.delete('/deleted/:id', deleteUser)




module.exports = router