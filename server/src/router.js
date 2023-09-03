const userRouter = require("./routes/AdminRoutes");
const eventRouter = require("./routes/EditorRoutes");
const moderRouter = require("./routes/ModeratorRoutes");
const noteRouter = require("./routes/ManagerRoutes");
const fileRouter = require("./routes/FileworkingRoutes");

function getRoutes(app)
{
    app.use('/account', userRouter );
    app.use('/event',   eventRouter);
    app.use('/moder',   moderRouter);
    app.use('/note',    noteRouter );
    app.use('/upload',  fileRouter );

    return;
}

module.exports = getRoutes;