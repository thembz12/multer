const userModel = require ("../userModel/usermodel.js")
const Jwt = require ("jsonwebtoken")
const bcrypt = require ("bcrypt")
const sendMail = require ("../helpers/email.js")
const html = require ("../helpers/html.js")

exports.signUp = async (req,res)=>{
    try{
        const {fullname,
               email,
               stack,
               qualification,
               password}= req.body
        const userCheck = await userModel.findOne({email})
        if(userCheck){
            return res.status(400).json({
                message:"this exist already"
            })
        }
        const saltedPassword = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, saltedPassword)
        const photos = req.files.map((file)=> file.filename)
        const user = new userModel({
            fullname,
            email,
            stack,
            qualification,
            images:photos,
            password: hashedPassword
        })
        const userToken = Jwt.sign({id:user._id, email:email,},process.env.JWT_SECRET,{expiresIn:"20mins"})
        const verifyLink = `${req.protocol}://${req.get("host")}/api/v1/users//${user._id}${userToken}`
        const mailOption = {
            email: user.email,
            subject:"verification mail",
            html: html.signUpTemplate(verifyLink, user.fullname)
        }
        await user.save()
        await sendMail(mailOption)
        res.status(201).json({
            message:"user created successfully"
        })
    }catch(error){
        res.status(500).json(error.message)
    }}

    exports.loginUser = async (req, res) => {
        try {
          const { email, password } = req.body;
          const userExist = await userModel.findOne({ email: email.toLowerCase() });
          if (!userExist) {
            return res.status(400).json({ message: "user not found" });
          }
      
          const confirmPassowrd = await bcrypt.compare(password, userExist.password);
          if (!confirmPassowrd) {
            return res.status(400).json({ message: "incorrect password" });
          }
          const token = await jwt.sign(
            {
              userId: userExist._id,
              email: userExist.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          res
            .status(200)
            .json({ message: "login successful", data: userExist, token });
        } catch (error) {
          res.status(500).json(error.message);
        }
      };
      

    exports.getOne = async (req, res) => {
        try {
            
            const oneUser = await UserModel.findById(email);
            if(!oneUser){
                return res.status(404).json({
                    message: 'User not found'
                })
            }
            res.status(200).json({
                message: 'User details',
                data: oneUser
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
    
    exports.getAll = async (req, res) => {
        try {
            const users = await UserModel.find();
            if(users.length === 0){
                return res.status(404).json({
                    message: 'No user found in this database'
                })
            }
            res.status(200).json({
                message: 'Users details',
                data: users
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
    
    exports.updateUser = async (req, res) => {
        try {
            const { id } = req.params
            const { name, stack } = req.body;
            const user = await UserModel.findById(id);
            if(!user){
                return res.status(404).json({
                    message: 'User not found'
                })
            }
            const data = {
                name: name || user.name,
                stack: stack || user.stack,
                image: user.image
            }
            // Check if the user is passing a image
            if(req.file && req.file.filename) {
                // Dynamically get the old image path
                const oldFilePath = `uploads/${user.image}`
                // Check if the file exists inside of the path
                if(fs.existsSync(oldFilePath)){
                    // Delete the existing image
                    fs.unlinkSync(oldFilePath)
                    // Update the data object
                    data.image = req.file.filename
                }
            }
            // Update the changes to our database
            const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true});
            // Send a succes response to the user
            res.status(200).json({
                message: 'User details updated successfully',
                data: updatedUser
            })
    
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
    
    exports.deleteUser = async (req,res)=>{
        try {
            const id = req.params.id
            const user = await UserModel.findByIdAndDelete(id)
            const oldFilePath = `uploads/${user.image}`
                // Check if the file exists inside of the path
                if(fs.existsSync(oldFilePath)){
                    // Delete the existing image
                    fs.unlinkSync(oldFilePath)
                    // Update the data object
                }
            res.status(200).json({
                message:"user deletd successfully"
            })
    
        } catch (error) {
            res.status(500).json(error.message)
            
        }
    }
     
    exports.verifyEmail = async (req,res)=>{
        try {
            const {token}= req.params
            const {email}= jwt.verify(token, process.env.JWT_SECRET)
            const user = await UserModel.findOne({email})
            if(!user){
                return res.status(404).json({
                    message:"user not found"
                })
            }
            user.isVerified = true
            await user.save()
    
            res.status(200).json({
                message:"link verified"
            })
            
        } catch (error) {
            if(error instanceof jwt.JsonWebTokenError){
                res.json({
                    message:"link expired"
                })
            }
            res.status(500).json(error.message)
            
        }
    }
    
    exports.resendVerification = async (req,res)=>{
        try{
            const {email}= req.body
            const user = await UserModel.findOne({email})
            if(!user){
                return res.status(400).json({
                    message:"user not found"
                })
            }
    
            if(user.isVerified){
                return res.status(400).json({
                    message:"user has already been verified"
            })
            }
            const token = jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:"20mins"})
            const verifyLink = `${req.protocol}://${res.get("host")}/router/verifyemail/${token}`
            const mailOptions = {
                email:email.user,
                subject:`resendVerification mail`,
                html: verifyTemplate(verifyLink,user.fullname)
            }
             
            await sendMail(mailOptions)
            res.status(200).json({
                message:"verification link resent successfully"
            })
            
    
        }catch(error){
            res.status(500).json(error.message)
        }
    }
    
    exports.forgotPassword = async (req, res) => {
        try {
            const {email}= req.body
            const user = await UserModel.findOne({email})
            if(!user){
                return res.status(404).json({
                    message:"user not found"
                })
            }
            const resetToken = jwt.sign({email:user.email}, process.env.JWT_SECRET,{expiresIn:"30mins"})
    
            const mailOptions={
                email:user.email,
                subject:"reset password",
                html: `please click this link to: <a href"${req.protocol}://${req.get("host")}/router/reset-password/${resetToken}">Reset Password</a>, Link expires in 30 minutes`
            }
            await sendMail(mailOptions)
            res.status(200).json({
                message:"password resset sent to email successfully"
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    };
    
    exports.resetPassword = async (req,res)=>{ 
        try {
            const {token} = req.params
            const {password} = req.body
    
            const [email] = jwt.verify(token, process.env.JWT_SECRET)
            const user = await UserModel.findOne([email])
            if(!user){
                return res.status(404).json({
                    message:"user not found"
            })
            }
            
            const saltedpassword = bcrypt.genSalt(10)
            const hashedpassword = bcrypt.hash(password, saltedpassword)
            
            user.password = hashedpassword
            await user.save()
            res.status(200).json({
                message:"password reset successfully"
            })
        } catch (error) {
            res.status(500).json(error.message)
            
        }
    } 
    
    
    exports.logOut = async (req, res) => {
        try {
            const auth = req.headers.authorization;
            const token = auth.split(' ')[1];
    
            if(!token){
                return res.status(401).json({
                    message: 'invalid token'
                })
            }
           
            const { email } = jwt.verify(token, process.env.JWT_SECRET);
           
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            user.blackList.push(token);
           
            await user.save();
           
            res.status(200).json({
                message: "User logged out successfully"
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
    