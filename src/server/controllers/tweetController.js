const { executeQuery } = require("../config/database");
const db = require("mssql");

// Modificar createTweet
const createTweet = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { tweet_text } = req.body;
    
    // Procesar archivos subidos
    const mediaUrls = req.files?.map(file => 
      `/uploads/${file.filename}` // ✅ Correcto
    ) || [];

    const query = `
      INSERT INTO tweets (user_id, tweet_text, media_urls) 
      OUTPUT INSERTED.tweet_id 
      VALUES (@user_id, @tweet_text, @media_urls)
    `;

    const inputs = [
      { name: "user_id", type: db.Int, value: user_id },
      { name: "tweet_text", type: db.NVarChar, value: tweet_text },
      { name: "media_urls", type: db.NVarChar, value: JSON.stringify(mediaUrls) }
    ];

    const result = await executeQuery(query, inputs);
    res.status(201).send({ 
      message: "Tweet creado correctamente",
      tweetId: result.recordset[0].tweet_id,
      mediaUrls
    });
  } catch (error) {
    console.error("Error al crear tweet:", error);
    res.status(500).send(error.message);
  }
};


// Obtener tweets de usuarios seguidos
const getTweetsByFollowing = async (req, res) => {
  const user_id = req.user.id;

  try {
    const query = `
      SELECT 
        tweets.tweet_id, 
        tweets.tweet_text, 
        tweets.media_urls,
        tweets.num_likes, 
        tweets.num_retweets, 
        tweets.num_comments, 
        tweets.created_at, 
        users.user_handle, 
        users.first_name, 
        users.last_name, 
        users.avatar_url,
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM tweet_likes tl 
            WHERE tl.tweet_id = tweets.tweet_id AND tl.user_id = @user_id
          ) THEN 1 
          ELSE 0 
        END AS liked
      FROM tweets
      JOIN users ON tweets.user_id = users.user_id
      JOIN followers ON followers.following_id = tweets.user_id
      WHERE followers.follower_id = @user_id 
      ORDER BY tweets.created_at DESC
    `;
    const inputs = [{ name: "user_id", type: db.Int, value: user_id }];
    const results = await executeQuery(query, inputs);

    res.send({ tweets: results.recordset });
  } catch (error) {
    console.error("Error al obtener tweets:", error);
    res.status(500).send("Error al obtener tweets");
  }
};

// Obtener los tweets del usuario autenticado
const getTweets = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT tweet_id, tweet_text, media_urls, num_likes, num_retweets, num_comments, tweets.created_at, 
             user_handle, first_name, last_name, avatar_url 
      FROM tweets
      JOIN users ON tweets.user_id = users.user_id
      WHERE tweets.user_id = @userId
      ORDER BY num_likes DESC, tweets.created_at DESC
    `;
    const inputs = [{ name: "userId", type: db.Int, value: userId }];
    const results = await executeQuery(query, inputs);

    res.send({ tweets: results.recordset });
  } catch (error) {
    console.error("Error al obtener tweets del usuario:", error);
    res.status(500).send("Error al obtener tweets");
  }
};

const getPopularTweets = async (req, res) => {
  try {
    const query = `
      SELECT tweet_id, tweet_text, media_urls, num_likes, num_retweets, num_comments, tweets.created_at, 
             user_handle, first_name, last_name, avatar_url 
      FROM tweets
      JOIN users ON tweets.user_id = users.user_id
      ORDER BY num_likes DESC, tweets.created_at DESC
    `;
    
    const results = await executeQuery(query);
    
    res.send({ tweets: results.recordset });
  } catch (error) {
    console.error("Error al obtener tweets populares:", error);
    res.status(500).send("Error al obtener tweets populares");
  }
};

// Obtener tweets de usuarios con intereses en común (excluyendo al usuario autenticado)
const getTweetsByInterest = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT *
      FROM (
        SELECT DISTINCT
          t.tweet_id,
          t.tweet_text,
          t.media_urls,
          t.num_likes,
          t.num_retweets,
          t.num_comments,
          t.created_at,
          u.user_handle,
          u.first_name,
          u.last_name,
          u.avatar_url,
          CASE
            WHEN i.user_id IS NOT NULL AND c.user_id IS NOT NULL THEN 2
            WHEN i.user_id IS NOT NULL THEN 1
            WHEN c.user_id IS NOT NULL THEN 1
            ELSE 0
          END AS prioridad
        FROM tweets t
        JOIN users u ON t.user_id = u.user_id
        LEFT JOIN (
          SELECT DISTINCT ud.user_id
          FROM user_details ud
          WHERE ud.category = 'interest'
            AND ud.detail_text IN (
              SELECT detail_text FROM user_details
              WHERE user_id = @userId AND category = 'interest'
            )
            AND ud.user_id != @userId
        ) i ON u.user_id = i.user_id
        LEFT JOIN (
          SELECT DISTINCT cm.user_id
          FROM community_members cm
          WHERE cm.community_id IN (
            SELECT community_id FROM community_members WHERE user_id = @userId
          )
          AND cm.user_id != @userId
        ) c ON u.user_id = c.user_id
        WHERE u.user_id != @userId
          AND u.user_id NOT IN (
            SELECT following_id FROM followers WHERE follower_id = @userId
          )
          AND (i.user_id IS NOT NULL OR c.user_id IS NOT NULL)
      ) AS resultados
      ORDER BY prioridad DESC, created_at DESC;
    `;

    const inputs = [{ name: "userId", type: db.Int, value: userId }];
    const result = await executeQuery(query, inputs);

    res.status(200).json({ tweets: result.recordset });
  } catch (error) {
    console.error("❌ Error al obtener tweets por interés:", error);
    res.status(500).json({ error: "Error al obtener tweets por interés" });
  }
};


// Obtener tweets de los usuarios seguidos (otra versión)
const getFollowingTweets = async (req, res) => {
  const userId = req.user.id;

  try {
    // Obtener la lista de usuarios seguidos por el usuario actual
    const followingQuery = `SELECT following_id FROM followers WHERE follower_id = @userId`;
    const followingInputs = [{ name: "userId", type: db.Int, value: userId }];
    const followingResults = await executeQuery(followingQuery, followingInputs);

    const followingIds = followingResults.recordset.map(follow => follow.following_id);

    if (followingIds.length === 0) {
      return res.send({ tweets: [] });
    }

    // Consulta para obtener los tweets de los usuarios seguidos y la información del retweeter si existe
    const tweetsQuery = `
           SELECT 
              t.tweet_id, 
              t.tweet_text,
              t.media_urls, 
              t.num_likes, 
              t.num_retweets, 
              t.num_comments, 
              t.created_at, 
              u.user_handle, 
              u.first_name, 
              u.last_name, 
              u.avatar_url,
              r.user_id AS retweeter_id, 
              ru.user_handle AS retweeter_handle,
              ot.user_id as original_user_id,
              ou.user_handle as original_user_handle,
              ot.tweet_text as original_tweet_text,
              ot.created_at as original_created_at,
              ou.avatar_url as original_avatar_url
          FROM tweets t
          JOIN users u ON t.user_id = u.user_id
          LEFT JOIN retweets r ON t.tweet_id = r.original_tweet_id
          LEFT JOIN users ru ON r.user_id = ru.user_id
          LEFT JOIN tweets ot ON r.original_tweet_id = ot.tweet_id
          LEFT JOIN users ou on ot.user_id = ou.user_id
          WHERE t.user_id IN (SELECT following_id FROM followers WHERE follower_id = @userId)
          OR t.tweet_id IN (
              SELECT original_tweet_id 
              FROM retweets 
              WHERE user_id IN (
                  SELECT following_id 
                  FROM followers 
                  WHERE follower_id = @userId
              )
          )
          ORDER BY t.created_at DESC;
        `;

        const tweetsResults = await executeQuery(tweetsQuery, [{ name: "userId", type: db.Int, value: userId }]); // Aqui se pasa la variable userId

    // Mapeamos los tweets para incluir la información del retweeter si existe
    const tweets = tweetsResults.recordset.map(tweet => ({
      ...tweet,
      retweeter: tweet.retweeter_handle || null // Agregar el handle del retweeter solo si existe
    }));

    res.send({ tweets });
  } catch (error) {
    console.error("Error al obtener tweets de los usuarios seguidos:", error);
    res.status(500).send("Error al obtener tweets");
  }
};

// Eliminar un tweet
const deleteTweet = async (req, res) => {
  const tweetId = req.params.tweet_id;
  const userId = req.user.id;

  try {
    const result = await executeQuery(
      "DELETE FROM tweets WHERE tweet_id = @tweetId AND user_id = @userId",
      [
        { name: "tweetId", type: db.Int, value: tweetId },
        { name: "userId", type: db.Int, value: userId },
      ]
    );

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Tweet eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Tweet no encontrado o no autorizado" });
    }
  } catch (error) {
    console.error("Error al eliminar el tweet:", error);
    res.status(500).json({ message: "Error al eliminar el tweet", error: error.message });
  }
};

// Editar un tweet
const editTweet = async (req, res) => {
  const tweetId = req.params.tweet_id;
  const { tweet_text } = req.body;

  try {
    await executeQuery(
      "UPDATE tweets SET tweet_text = @tweet_text WHERE tweet_id = @tweet_id",
      [
        { name: "tweet_text", type: db.NVarChar, value: tweet_text },
        { name: "tweet_id", type: db.Int, value: tweetId },
      ]
    );
    res.status(200).json({ message: "Tweet actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el tweet:", error);
    res.status(500).json({ message: "Error al actualizar el tweet", error: error.message });
  }
};

const likeTweet = async (req, res) => {
  const { tweet_id } = req.body;
  const user_id = req.user.id;

  try {
    // Verificar si el usuario ya ha dado like a este tweet
    const checkQuery = `
      SELECT * FROM tweet_likes WHERE tweet_id = @tweet_id AND user_id = @user_id
    `;
    const checkInputs = [
      { name: "tweet_id", type: db.Int, value: tweet_id },
      { name: "user_id", type: db.Int, value: user_id },
    ];
    const checkResult = await executeQuery(checkQuery, checkInputs);

    if (checkResult.recordset.length > 0) {
      // Si ya dio like, lo quitamos de tweet_likes
      const unlikeQuery = `
        DELETE FROM tweet_likes WHERE tweet_id = @tweet_id AND user_id = @user_id
      `;
      await executeQuery(unlikeQuery, checkInputs);

      // Actualizamos el contador de likes, asegurándonos que no baje de 0
      const updateTweetQuery = `
        UPDATE tweets 
        SET num_likes = CASE WHEN num_likes > 0 THEN num_likes - 1 ELSE 0 END 
        WHERE tweet_id = @tweet_id
      `;
      await executeQuery(updateTweetQuery, [{ name: "tweet_id", type: db.Int, value: tweet_id }]);

      return res.status(200).json({ message: "Like eliminado correctamente", liked: false });
    } else {
      // Si no ha dado like, lo agregamos en tweet_likes
      const likeQuery = `
        INSERT INTO tweet_likes (tweet_id, user_id) VALUES (@tweet_id, @user_id)
      `;
      await executeQuery(likeQuery, checkInputs);

      // Actualizamos el contador de likes aumentando en 1
      const updateTweetQuery = `
        UPDATE tweets SET num_likes = num_likes + 1 WHERE tweet_id = @tweet_id
      `;
      await executeQuery(updateTweetQuery, [{ name: "tweet_id", type: db.Int, value: tweet_id }]);

      return res.status(200).json({ message: "Like agregado correctamente", liked: true });
    }
  } catch (error) {
    console.error("Error al dar/quitar like:", error);
    res.status(500).json({ message: "Error al dar/quitar like", error: error.message });
  }
};

const getCommentsByTweet = async (req, res) => {
  const tweet_id = parseInt(req.params.tweetId, 10);

  try {
    const query = `
      SELECT 
        c.comment_id, 
        c.tweet_id, 
        c.comment_text, 
        c.created_at,
        u.user_handle, 
        u.avatar_url
      FROM tweet_comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.tweet_id = @tweet_id
      ORDER BY c.created_at ASC
    `;
    const inputs = [{ name: "tweet_id", type: db.Int, value: tweet_id }];
    const result = await executeQuery(query, inputs);
    res.status(200).json({ comments: result.recordset });
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ message: "Error al obtener comentarios", error: error.message });
  }
};

const createComment = async (req, res) => {
  // Usamos el tweet_id de los parámetros para mayor claridad
  const tweet_id = parseInt(req.params.tweetId, 10);
  const { comment_text } = req.body;
  const user_id = req.user.id;

  try {
    // Inserta el comentario y obtiene el ID insertado
    const insertQuery = `
      INSERT INTO tweet_comments (tweet_id, user_id, comment_text)
      OUTPUT INSERTED.comment_id
      VALUES (@tweet_id, @user_id, @comment_text)
    `;
    const inputs = [
      { name: "tweet_id", type: db.Int, value: tweet_id },
      { name: "user_id", type: db.Int, value: user_id },
      { name: "comment_text", type: db.NVarChar, value: comment_text },
    ];
    const insertResult = await executeQuery(insertQuery, inputs);
    const newCommentId = insertResult.recordset[0].comment_id;

    // Actualiza el contador de comentarios en la tabla tweets
    const updateTweetQuery = `
      UPDATE tweets SET num_comments = num_comments + 1 WHERE tweet_id = @tweet_id
    `;
    await executeQuery(updateTweetQuery, [
      { name: "tweet_id", type: db.Int, value: tweet_id },
    ]);

    // Recupera los datos completos del comentario recién insertado, uniendo con la tabla de usuarios
    const selectQuery = `
      SELECT 
        c.comment_id, 
        c.tweet_id, 
        c.comment_text, 
        c.created_at,
        u.user_handle, 
        u.avatar_url
      FROM tweet_comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.comment_id = @comment_id
    `;
    const selectResult = await executeQuery(selectQuery, [
      { name: "comment_id", type: db.Int, value: newCommentId },
    ]);
    const comment = selectResult.recordset[0];

    res.status(200).json({ 
      message: "Comentario agregado correctamente", 
      comment 
    });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ message: "Error al agregar comentario", error: error.message });
  }
};

const toggleRetweet = async (req, res) => {
  const { tweet_id } = req.body;
  const user_id = req.user.id;

  try {
    // Verificar si ya existe un retweet de este tweet por parte del usuario
    const checkQuery = `
      SELECT * FROM retweets 
      WHERE original_tweet_id = @tweet_id AND user_id = @user_id
    `;
    const checkInputs = [
      { name: "tweet_id", type: db.Int, value: tweet_id },
      { name: "user_id", type: db.Int, value: user_id },
    ];
    const checkResult = await executeQuery(checkQuery, checkInputs);

    if (checkResult.recordset.length > 0) {
      // Si ya retweteó, se elimina el retweet
      const deleteQuery = `
        DELETE FROM retweets 
        WHERE original_tweet_id = @tweet_id AND user_id = @user_id
      `;
      await executeQuery(deleteQuery, checkInputs);

      // Actualizar contador (disminuir)
      const updateQuery = `
        UPDATE tweets 
        SET num_retweets = CASE WHEN num_retweets > 0 THEN num_retweets - 1 ELSE 0 END 
        WHERE tweet_id = @tweet_id
      `;
      await executeQuery(updateQuery, [{ name: "tweet_id", type: db.Int, value: tweet_id }]);

      return res.status(200).json({ message: "Retweet eliminado correctamente", retweeted: false });
    } else {
      // Si no ha retweteado, se inserta el retweet
      const insertQuery = `
        INSERT INTO retweets (user_id, original_tweet_id) 
        VALUES (@user_id, @tweet_id)
      `;
      await executeQuery(insertQuery, checkInputs);

      // Actualizar contador (aumentar)
      const updateQuery = `
        UPDATE tweets SET num_retweets = num_retweets + 1 
        WHERE tweet_id = @tweet_id
      `;
      await executeQuery(updateQuery, [{ name: "tweet_id", type: db.Int, value: tweet_id }]);

      return res.status(200).json({ message: "Retweet agregado correctamente", retweeted: true });
    }
  } catch (error) {
    console.error("Error al hacer retweet:", error);
    res.status(500).json({ message: "Error al hacer retweet", error: error.message });
  }
};
// En tu userController.js o tweetController.js (donde hagas esta lógica)
const getTweetsByUserHandle = async (req, res) => {
  const { handle } = req.params;

  try {
    const query = `
      SELECT t.tweet_id, t.user_id, t.tweet_text, t.media_urls, u.user_handle, u.avatar_url
      FROM tweets t
      INNER JOIN users u ON t.user_id = u.user_id
      WHERE u.user_handle = @handle
      ORDER BY t.created_at DESC
    `;

    const inputs = [{ name: "handle", type: db.VarChar, value: handle }];
    const result = await executeQuery(query, inputs);

    res.status(200).json({ tweets: result.recordset });
  } catch (error) {
    console.error("❌ Error al obtener tweets por handle:", error);
    res.status(500).json({ error: "Error al obtener tweets del usuario" });
  }
};



module.exports = {
  createTweet,
  getTweetsByFollowing,
  getTweetsByInterest,
  getTweets,
  getFollowingTweets,
  deleteTweet,
  editTweet,
  likeTweet,
  createComment,
  getCommentsByTweet,
  toggleRetweet,
  getPopularTweets,
  getTweetsByUserHandle
};