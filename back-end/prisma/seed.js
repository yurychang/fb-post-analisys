const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

let rawdata = fs.readFileSync('prisma/init-data.json');
let initData = JSON.parse(rawdata);

async function main() {
    const record = await prisma.fetchRecord.create({
        data: {
            fetch_time: new Date(),
        },
    });
    console.log({ record });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
