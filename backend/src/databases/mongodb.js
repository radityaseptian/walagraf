import mongoose from 'mongoose'
import 'dotenv/config'

await mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

export default mongoose
