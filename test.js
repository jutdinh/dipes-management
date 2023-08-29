const { Projects, ProjectsRecord } = require("./models/Projects")

const ProjectsModel = new Projects()

const Project = new ProjectsRecord({
    id: 1,
    project_id: 1,
    project_name: "Dự án của bé Mốc nè",
    versions: {
        "id1": {
            id: 1,
            version_id: 1,
            version_name: "v.0.0.1",
            tables: {
                "id1": {
                    id: 1,
                    table_id: 1,
                    table_name: "Khách hàng nè",
                },
                "id2": {
                    id: 2,
                    table_id: 2,
                    table_name: "Ngộ he klkk",
                    ngohe: "Khum xuan hien"
                }
            }
        },
        "id2": {
            id: 2,
            version_id: 2,
            version_name: "v.0.0.2"
        }
    }
})

Project.save()

// process.exit(0)