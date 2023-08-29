const Crypto = require('./controllers/Crypto')

const { Accounts, AccountsRecord } = require('./models/Accounts')
const { Projects, ProjectsRecord } = require('./models/Projects')



const USER_PRIVILEGES = ["uad", "ad", "pm", "pd", "ps"]
const PASSWORD  = "1"


const SU = {
    username: "su",
    fullname: "Administrator",
    avatar: "/image/avatar/su.png"
}

const DATATYPES = Projects.validTypes

const FIELD_PROPS = {
        DATATYPE: "INT",
        NULL: true,
        LENGTH: 65355,
        AUTO_INCREMENT: true,
        MIN: 0,
        MAX: 10000000,
        FORMAT: "DD/MM/YYY hh:mm:ss",
        PATTERN: "AUTO[NNNNN]",
        DECIMAL_PLACE: 2,
        DEFAULT: "",
        DEFAULT_TRUE: "TRUE",
        DEFAULT_FALSE: "FALSE",
}

const DEFAULT_PROJECT_AMOUNT    = 50;
const DEFAULT_TABLE_AMOUNT      = 20;
const DEFAULT_FIELD_AMOUNT      = 20;
const DEFAULT_TASK_AMOUNT       = 120;
const DEFAULT_TASK_MEMBERS_AMOUNT = 3;

const makeNames = (rawString) => {
    const splitted = rawString.split(" ")
    const names = []
    for( let i = 0 ; i < splitted.length; i+=3 ){
        const name = splitted[i] + " " + splitted[i + 1] + " " + splitted[i + 2];
        names.push( name.toUpperCase() )
    }
    return names
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const stringifyDate = ( date ) => {
    return `${ date.getFullYear() }-${ formatDecNum(date.getMonth() + 1) }-${ formatDecNum(date.getDate()) }`
}

const formatDecNum = (num) => {
    if( num < 10 ){
        return `0${num}`
    }
    return num.toString()
}

const NAMES = makeNames(`Feet dont fail me now Take me to your finish line Oh my heart it breaks every step that take But Im hoping that the gates theyll tell me that youre mine Walking through the city streets Is it by mistake or design feel so alone on a Friday night Can you make it feel like home if tell you youre mine Its like told you honey Dont make me sad dont make me cry Sometimes love is not enough and the road gets tough dont know why Keep making me laugh Lets go get high The road is long we carry on Try to have fun in the meantime Come take a walk on the wild side Let me kiss you hard in the pouring rain You like your girls insane So choose your last words this is the last time Cause you and I we were born to die Lost but now am found can see but once was blind was so confused as a little child Tried to take what could get Scared that couldnt find All the answers honey Dont make me sad dont make me cry Sometimes love is not enough and the road gets tough dont know why Keep making me laugh Lets go get high The road is long we carry on Try to have fun in the meantime Come take a walk on the wild side Come kiss me hard in the pouring rain You like your girls insane So choose your last words this is the last time Cause you and I we were born to die We were born to die We were born to die Come and take a walk on the wild side Let me kiss you hard in the pouring rain You like your girls insane Dont make me sad dont make me cry Sometimes love is not enough and the road gets tough dont know why Keep making me laugh Lets go get high The road is long we carry on Try to have fun in the meantime Come take a walk on the wild side Let me kiss you hard in the pouring rain You like your girls insane Choose your last words this is the last time Cause you and I we were born to die`)


const formatIndex = (index) => {
    let format = "0000"
    const stringifiedIndex = index.toString()
    return `${ format.slice(0, format.length - stringifiedIndex.length) }${ stringifiedIndex }`
}



const createAccount = async ( amount, role = "ad" ) => {
    const NewAccounts = []
    const Cipher = new Crypto()
    const initialPassword = PASSWORD;
    const encryptedPassword = Cipher.encrypt(initialPassword)

    for( let i = 0; i < amount; i++ ){
        const username = `auto_${ role }_${ formatIndex(i) }`;
        const Account = new AccountsRecord({
            username,
            fullname: NAMES[ i % NAMES.length ],
            role,
            password: encryptedPassword, 
            email: `auto_${ role }_${ formatIndex(i) }@mylangroup.com`, 
            phone: "01234567890", 
            avatar: `/image/avatar/${ username }.png`, 
            address: NAMES[ (i - 1) % NAMES.length + 1 ]+NAMES[ (i + 1) % NAMES.length + 1 ], 
            note: "This account was created automatically for testing purposes", 
            create_by: SU, 
            create_at: new Date()   
        })
            
        await Account.save()
        Account.makeFirstAva()
        NewAccounts.push( Account.get() )
    }    
    return NewAccounts
}


const createProject = async ( accounts, index ) => {
    let manager = accounts[ index % 5 ]
    if( !manager ){
        manager = accounts[0]
    }
    const filtedMembers = accounts.filter( acc => acc.username != manager.username )
    const members = filtedMembers.slice(0, 5)
    
    const serializedMember = {}
    members.map( member => { serializedMember[`${ member.username }`] = {...member, permission: ["supervisor", "deployer"][ index % 2 ]} } )

    const versions = {}
    versions[`${ index }`] = {
        version_id: index,
        version_name: `v0.0.0.1`,
        tables: {},
        apis: {},
        ui: {},
        create_by: SU,
    } 
    const tables = {}
    for( let i = 1; i < DEFAULT_TABLE_AMOUNT + 1 ; i++ ){
        const table = {
            id: i,
            table_name: `TABLE-${ formatIndex(i) }`,
            table_alias: `TB${ index }`,
            primary_key: [ i*DEFAULT_FIELD_AMOUNT ],
            foreign_keys: [],
            fields: [],
            create_by: SU,          
        }
        
        for( let j = 0 ; j < DEFAULT_FIELD_AMOUNT; j++ ){
            const uniqueID = i*DEFAULT_FIELD_AMOUNT + j
            const props = { ...FIELD_PROPS }

            const field = {
                id: uniqueID,
                field_name: `FIELD_${ uniqueID }`,
                fomular_alias: `FIELD_${ uniqueID }`,
                create_by: SU,
                props
            }
            table.fields[`${ uniqueID }`] = field;;
        }

        if( i < DEFAULT_FIELD_AMOUNT - 3 ){
            table.foreign_keys = [
                { field_id: i*DEFAULT_FIELD_AMOUNT + 1, table_id: i + 1, ref_field_id: (i + 1)*DEFAULT_FIELD_AMOUNT },
                { field_id: i*DEFAULT_FIELD_AMOUNT + 2, table_id: i + 2, ref_field_id: (i + 2)*DEFAULT_FIELD_AMOUNT },
                { field_id: i*DEFAULT_FIELD_AMOUNT + 3, table_id: i + 3, ref_field_id: (i + 3)*DEFAULT_FIELD_AMOUNT },
            ]
        }
        tables[`${i}`] = table
    }
    versions[`${ index }`].tables = tables

    const tasks = {}    
    for( let i = 0 ; i < DEFAULT_TASK_AMOUNT; i++ ){        
        const today = new Date(`2023-08-${ getRandomInt(29) + 1 }`)
        const nextDate = new Date()
        nextDate.setDate( today.getDate() + getRandomInt(13) + 2 )

        const randomTaskMembers = {}
        for( let g = 0 ; g < DEFAULT_TASK_MEMBERS_AMOUNT; g++ ){
            const randomIndex = getRandomInt( members.length - 1 );
            const member = members[ randomIndex ];
            randomTaskMembers[ `${ member.username }` ] = member
        }

        const task = {
            task_id: i,
            task_name: `SAMPLE TASK - ${ i }`,
            task_description: "This task was automatically created for testing purpose. DO NOT modify it for any reason!",
            task_status: (i % 4) + 1,
            task_priority: ( i % 3) + 1,
            task_approve: (i % 4) + 1 == 3 ? [true, false, false][ getRandomInt(2) ]: false,
            start: stringifyDate(today),
            end: stringifyDate(nextDate),
            task_progress: getRandomInt(5) * 20,
            members: randomTaskMembers,
            create_by: SU,
        }
        tasks[`${ i }`] = task
    }
    
    versions[`${ index }`].tasks = tasks;

    const project = {
        project_name: `PROJECT - ${ index }`,
        project_code: `#PJ${ formatIndex(index) }`,
        project_status: (index % 5) + 1,
        project_description: "This task was automatically created for testing purpose. DO NOT modify it for any reason!",
        project_type: ["api", "database"][ index % 2 ],
        proxy_server: "http://127.0.0.1:5000",
        create_at: new Date(),

        manager,
        members: serializedMember,
        create_by: SU,

        versions,
        tasks
    }

    const Project = new ProjectsRecord( project )
    await Project.save()
    console.log(`CREATE PROJECT ${ index } - ${ NAMES[ (index - 1) % NAMES.length + 1 ]+NAMES[ (index + 1) % NAMES.length + 1 ] }`)
}

const MAIN = async () => {
    const admins    = await createAccount(2, "ad");
    const operators = await createAccount(10, "pm");
    const deployee  = await createAccount(16, "pd");
    
    const accounts = [...admins, ...operators, ...deployee ]
    // const AccountsModel = new Accounts()
    // const accounts = await AccountsModel.findAll()
    for( let i = 0 ; i < DEFAULT_PROJECT_AMOUNT; i++ ){
        await createProject( accounts, i )
    }

    process.exit(0)
}

MAIN()