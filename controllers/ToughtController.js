const Tought = require('../models/Tought')
const User = require('../models/User')

const { Op } = require('sequelize') 

module.exports = class ToughtController {
    static async showToughts(req, res){
        let search = ''
        if(req.query.search){
            search = req.query.search
        }
        let order = req.query.order === 'old' ? 'ASC' :'DESC'

        const toughts = await Tought.findAll({ 
            include: User, 
            where:{ 
                title:{[Op.like]:`%${search}%`}
            },
            order:[['createdAt', order]]
        })
        const tought = toughts.map((result) => result.get({plain:true}))
        let qty = tought.length

        if(qty === 0){
            qty = false
        }

        //console.log(tought)

        res.render('toughts/home', {tought, search, qty})
    }
    static async dashboard(req, res){

        const userId = req.session.userid
        if(!userId){
            res.redirect('/login')
        }
        const user = await User.findOne({
            where:{id:userId},
            include: Tought,
            plain:true
        })
        if(!user){
            res.redirect('/login')
        }
        const toughts = user.Toughts.map((result) => result.dataValues)
        
        let empty = false

        if(toughts.length === 0){
            empty = true
        }

        res.render('toughts/dashboard', { toughts, empty })
    }
    static createTought(req, res){
        res.render('toughts/create')
    }
    static async createToughtSave(req, res){
        const tought = {
           title: req.body.title,
           UserId: req.session.userid
        }
        await Tought.create(tought)
        
        try{
            req.flash('message', 'Pensamento criado com sucesso!')
            req.session.save(()=>{
                res.redirect('/toughts/dashboard')
            })
        }catch(error){
            console.log(error)
        }
    }
    static async update(req, res){
        const id = req.params.id
        const tought = await Tought.findOne({where:{id:id}, raw:true})
        
        res.render('toughts/edit', {tought})
    }
    static async updateSave(req,res){
        const id  = req.body.id
        const tought = {
            title: req.body.title
        }

        
        try{
            await Tought.update( tought, {where:{id:id}})
            req.flash('message', 'Pensamento atualizado com sucesso!')
            req.session.save(()=>{
                res.redirect('/toughts/dashboard')
            })
        }catch(error){
            console.log(error)
        }
    }
    static async destroy(req, res){
      
        const id =  req.body.id
        const UserId =  req.session.userid
        try{
            await Tought.destroy({where:{id:id, UserId:UserId}})
            req.flash('message', 'Pensamento removido com sucesso!')
            req.session.save(()=>{
                res.redirect('/toughts/dashboard')
            })
        }catch(error){
            console.log(error)
        }
    }
}