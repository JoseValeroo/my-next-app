import axios from "axios";
import { faker } from "@faker-js/faker";
import tough from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

// 📡 Endpoints
const LOGIN_URL = "/api/auth/login";
const TWEET_URL = "/api/tweets/create";

// 🔍 Usuarios con bio específica (simulados porque no tenemos endpoint)
const usuarios = [
  { user_handle: "prueba2200", password: "test1234" },
  { user_handle: "nathen1", password: "test1234" },
  { user_handle: "nikolas2", password: "test1234" },
  { user_handle: "euna3", password: "test1234" },
  { user_handle: "evelyn4", password: "test1234" },
  { user_handle: "felicita5", password: "test1234" },
  { user_handle: "bernie6", password: "test1234" },
  { user_handle: "candice7", password: "test1234" },
  { user_handle: "thaddeus8", password: "test1234" },
  { user_handle: "geovanny9", password: "test1234" },
  { user_handle: "dawn10", password: "test1234" },
  { user_handle: "alvera11", password: "test1234" },
  { user_handle: "helene12", password: "test1234" },
  { user_handle: "nathaniel13", password: "test1234" },
  { user_handle: "marta14", password: "test1234" },
  { user_handle: "claudia15", password: "test1234" },
  { user_handle: "jeanne16", password: "test1234" },
  { user_handle: "brant17", password: "test1234" },
  { user_handle: "karlee18", password: "test1234" },
  { user_handle: "yolanda19", password: "test1234" },
  { user_handle: "jan20", password: "test1234" },
  { user_handle: "buster21", password: "test1234" },
  { user_handle: "phoebe22", password: "test1234" },
  { user_handle: "porter23", password: "test1234" },
  { user_handle: "imelda24", password: "test1234" },
  { user_handle: "daniella25", password: "test1234" },
  { user_handle: "jaycee26", password: "test1234" },
  { user_handle: "name27", password: "test1234" },
  { user_handle: "burley28", password: "test1234" },
  { user_handle: "susanna29", password: "test1234" },
  { user_handle: "noe30", password: "test1234" },
  { user_handle: "gust31", password: "test1234" },
  { user_handle: "lynn32", password: "test1234" },
  { user_handle: "geovanni33", password: "test1234" },
  { user_handle: "edna34", password: "test1234" },
  { user_handle: "khalil35", password: "test1234" },
  { user_handle: "keara36", password: "test1234" },
  { user_handle: "otho37", password: "test1234" },
  { user_handle: "khalil38", password: "test1234" },
  { user_handle: "vickie39", password: "test1234" },
  { user_handle: "anahi40", password: "test1234" },
  { user_handle: "geo41", password: "test1234" },
  { user_handle: "noel42", password: "test1234" },
  { user_handle: "hilbert43", password: "test1234" },
  { user_handle: "justine44", password: "test1234" },
  { user_handle: "madie45", password: "test1234" },
  { user_handle: "garrison46", password: "test1234" },
  { user_handle: "delaney47", password: "test1234" },
  { user_handle: "declan48", password: "test1234" },
  { user_handle: "reggie49", password: "test1234" },
  { user_handle: "terrance50", password: "test1234" },
  { user_handle: "nikita51", password: "test1234" },
  { user_handle: "dandre52", password: "test1234" },
  { user_handle: "edwardo53", password: "test1234" },
  { user_handle: "eliza54", password: "test1234" },
  { user_handle: "kole55", password: "test1234" },
  { user_handle: "joany56", password: "test1234" },
  { user_handle: "lorenz57", password: "test1234" },
  { user_handle: "lauren58", password: "test1234" },
  { user_handle: "terrill59", password: "test1234" },
  { user_handle: "walter60", password: "test1234" },
  { user_handle: "jarret61", password: "test1234" },
  { user_handle: "lewis62", password: "test1234" },
  { user_handle: "theodora63", password: "test1234" },
  { user_handle: "antonetta64", password: "test1234" },
  { user_handle: "frances65", password: "test1234" },
  { user_handle: "hayley66", password: "test1234" },
  { user_handle: "aubree67", password: "test1234" },
  { user_handle: "bryana68", password: "test1234" },
  { user_handle: "gabrielle69", password: "test1234" },
  { user_handle: "thurman70", password: "test1234" },
  { user_handle: "talia71", password: "test1234" },
  { user_handle: "dejuan72", password: "test1234" },
  { user_handle: "alexandrine73", password: "test1234" },
  { user_handle: "baylee74", password: "test1234" },
  { user_handle: "gregorio75", password: "test1234" },
  { user_handle: "niko76", password: "test1234" },
  { user_handle: "kelly77", password: "test1234" },
  { user_handle: "ila78", password: "test1234" },
  { user_handle: "riley79", password: "test1234" },
  { user_handle: "monserrat80", password: "test1234" },
  { user_handle: "reyes81", password: "test1234" },
  { user_handle: "jordi82", password: "test1234" },
  { user_handle: "wade83", password: "test1234" },
  { user_handle: "vicky84", password: "test1234" },
  { user_handle: "aubree85", password: "test1234" },
  { user_handle: "leatha86", password: "test1234" },
  { user_handle: "rigoberto87", password: "test1234" },
  { user_handle: "tianna88", password: "test1234" },
  { user_handle: "caitlyn89", password: "test1234" },
  { user_handle: "carli90", password: "test1234" },
  { user_handle: "aisha91", password: "test1234" },
  { user_handle: "reece92", password: "test1234" },
  { user_handle: "monte93", password: "test1234" },
  { user_handle: "sydnee94", password: "test1234" },
  { user_handle: "brandt95", password: "test1234" },
  { user_handle: "alvah96", password: "test1234" },
  { user_handle: "margarete97", password: "test1234" },
  { user_handle: "rosalee98", password: "test1234" },
  { user_handle: "audie99", password: "test1234" },
];

const imgurIds = [
  "xFQ6aQS", "Q9L3XTl", "F3kdF1C", "zvZVyWZ", "4yXUzVt",
  "XpAKZGC", "Wfv6cAK", "Lb6DZZ2", "n03bKzK", "pREyYqG"
];

const getRandomImgur = () => {
  const id = imgurIds[Math.floor(Math.random() * imgurIds.length)];
  return `https://i.imgur.com/${id}.jpg`;
};

// 📤 Generar texto de tweet realista
const generarTweet = () =>
  faker.lorem.sentence({ min: 6, max: 12 });

// 🚀 Lógica principal
const crearTweetsParaUsuarios = async () => {
  for (const usuario of usuarios) {
    const jar = new tough.CookieJar();
    const client = wrapper(axios.create({ jar, withCredentials: true }));

    try {
      await client.post(LOGIN_URL, {
        user_handle: usuario.user_handle,
        password: usuario.password,
        rememberMe: false
      });

      console.log(`✅ Login correcto: ${usuario.user_handle}`);

      for (let i = 0; i < 3; i++) {
        const tweet_text = generarTweet();
        const media_urls = i === 2 ? [getRandomImgur()] : []; // solo el 3er tweet tiene imagen
      
        await client.post(TWEET_URL, {
          tweet_text,
          media_urls: JSON.stringify(media_urls)
        });
      
        console.log(`📝 Tweet ${i + 1} de ${usuario.user_handle}: "${tweet_text}" ${media_urls.length ? '[📷 imagen incluida]' : ''}`);
      }
      

    } catch (err) {
      console.error(`❌ Error con ${usuario.user_handle}:`, err.response?.data || err.message);
    }
  }

  console.log("🎉 Todos los tweets fueron generados.");
};

crearTweetsParaUsuarios();
