const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

// helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')


module.exports = class UserController {

    // register
        static async register(req, res) {
          const name = req.body.name
          const email = req.body.email
          const phone = req.body.phone
          const password = req.body.password
          const confirmpassword = req.body.confirmpassword
      
          // validations
          if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
          }
      
          if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
          }
      
          if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
          }
      
          if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
            return
          }
      
          if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória!' })
            return
          }
      
          if (password != confirmpassword) {
            res
              .status(422)
              .json({ message: 'A senha e a confirmação precisam ser iguais!' })
            return
          }
      

          // check if user exist
          const userExist = await User.findOne({email: email})
          if(userExist){
            res.status(422)
              .json({ message: 'Um usuario com esse email ja existe!' })
            return
          }

          // create a password
          const sald = await bcrypt.genSalt(12)
          const passwordHash = await bcrypt.hash(password, salt)

           //create user
           const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash,
          })

          try {

            const newUser = await user.save()
            
            // helper create-user-token
            await createUserToken(newUser, req, res)

          } catch (error) {

            res.status(500).json({message: error})

          }
        }

         // login
         static async login(req, res){

            const {email, password} = req.body

            // validations
            if(!email){
                res.status(422).json({ message: 'O e-mail é obrigatorio'})
            }

            if(!password){
                res.status(422).json({ message: 'O senha é obrigatorio'})
            }

            // check if user exist
          const user = await User.findOne({email: email})
          if(!user){
            res.status(422)
              .json({ message: 'Não há usuario cadastrado com este e-mail!' })
            return
          }

           // check if password match with db password
           const checkPassword = await bcrypt.compare(password, user.password)

           if(!checkPassword){
            res.status(422)
              .json({ message: 'Senha inválida!' })
            return
           }

           // helper create-user-token
           await createUserToken(newUser, req, res)
         }

         // Checking user by token
         static async checkUser(req, res){

            let currentUser

            console.log(req.headers.authorization)

            if(req.headers.authorization){

                const token = getToken(req)
                const decoded = jwt.verify(token, 'nossosecret')

                currentUser = await User.findById(decoded.id)

                currentUser.password = undefined

            }else{
                currentUser = null
            }

            res.status(200).send(currentUser)
         }

         // requiring user by id
         static async getUserById(req, res){

            const id = req.params.id

            //check if user exist
            const token = getToken(req)
            const user = await getUserByToken(token)

            if(!user){
                res.status(422)
                  .json({ message: 'Usuario não encontrado!' })
                return
               }

               res.status(200).json({ user })

         }

         //
         static async editUser(req, res){
            
            const id = req.params.id

            const name = req.body.name
            const email = req.body.email
            const phone = req.body.phone
            const password = req.body.password
            const confirmpassword = req.body.confirmpassword

            let image = ''

            // validations
            if (!name) {
                res.status(422).json({ message: 'O nome é obrigatório!' })
                return
              }
          
              user.name = name
          
              if (!email) {
                res.status(422).json({ message: 'O e-mail é obrigatório!' })
                return
              }

              // check if email has already taken
            const userExists = await User.findOne({ email: email })

            if (user.email !== email && userExists) {
                res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
                return
              }

              user.email = email

              if (image) {
                const imageName = req.file.filename
                user.image = imageName
              }
          
              if (!phone) {
                res.status(422).json({ message: 'O telefone é obrigatório!' })
                return
              }
          
              user.phone = phone

               // check if password match
    if (password != confirmpassword) {
        res.status(422).json({ error: 'As senhas não conferem.' })
  
        // change password
      } else if (password == confirmpassword && password != null) {
        // creating password
        const salt = await bcrypt.genSalt(12)
        const reqPassword = req.body.password
  
        const passwordHash = await bcrypt.hash(reqPassword, salt)
  
        user.password = passwordHash
       }
  
       try {
           // returns updated data
           const updatedUser = await User.findOneAndUpdate(
             { _id: user._id },
             { $set: user },
             { new: true },
        )
          res.json({
             message: 'Usuário atualizado com sucesso!',
             data: updatedUser,
          })
         } catch (error) {
          res.status(500).json({ message: error })
         }

         }
}