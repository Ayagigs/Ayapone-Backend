import postmanToOpenApi from 'postman-to-openapi'

try {
  const result = await postmanToOpenApi('./src/doc/thunder.json', './src/doc/collection.json', {
    defaultTag: 'API',
    outputFormat: 'json',
    info: {
        title: 'Ayapone Backend APIs',
        version: '1.0',
        description: 'Powering the next generation cryptocurrency e-Commerce platform.',
        license: {
            name: 'GNU GENERAL PUBLIC LICENSE',
            url: 'https://github.com/Ayagigs/Ayapone-Backend/blob/main/LICENSE'
        },
        contact: {
            url: 'https://github.com/Ayagigs/Ayapone-Backend/issues'
        },
        xLogo: {
            url: 'https://github.com/Ayagigs/Ayapone-Backend/blob/main/assets/imgs/ayapone.png?raw=true',
            backgroundColor: '#FFFFFF',
            altText: 'AYAPONE'
        }
    }
  })
} catch (err) {
  console.log(err)
}
