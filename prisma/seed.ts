import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
const prisma = new PrismaClient()

const main = async () => {
  // Create 50 fake users.
  const fakeArray = Array.from({ length: 50 }, (_, i) => i)
  console.log("Seeding the database...")

  for await (const i of fakeArray) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        image: faker.image.avatar(),
      },
    })

    const postsFakeArray = Array.from({
      length: faker.number.int({ min: 5, max: 20, })
    })
      .map((_, i) => i)

    for await (const postIterator of postsFakeArray) {
      await prisma.post.create({
        data: {
          title: faker.lorem.words(10),
          description: faker.lorem.lines(4),
          text: faker.lorem.paragraphs(5),
          html: faker.lorem.paragraphs(5),
          slug: faker.lorem.slug(),
          author: {
            connect: {
              id: user.id,
            },
          },
          featuredImage: faker.image.urlLoremFlickr({ width: 200, height: 200 }),
          tags: {
            connectOrCreate: {
              create: {
                name: faker.word.words(4),
                description: faker.lorem.paragraph(1),
                slug: faker.lorem.slug(),
              },
              where: {
                id: faker.string.uuid(),
              }
            }
          }
        },
      })
    } // For loop of postsFakeArray
    console.log('Seeding completed')
  } // for loop of fakeArray
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

