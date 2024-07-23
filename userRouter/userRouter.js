const { CreateValidator, loginValidator } = require("../middleware/validator")
const { signUp, getOne, getAll, updateUser, deleteUser, logOut, loginUser } = require("../userController/userController")
const upload = require("../utils/multer")
const router = require ("express").Router()


router.post("/signup", upload.array("images", 5),CreateValidator ,signUp)

router.post("/login/", loginValidator, loginUser)

router.get('/one/:id', getOne)

router.get('/all', getAll)

router.put('/update/:id', upload.single('image'), updateUser)

router.delete('/deleted/:id', deleteUser)

router.post("/logout/",logOut )





module.exports = router