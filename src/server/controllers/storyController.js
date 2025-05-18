const { executeQuery } = require("../config/database");
const db = require("mssql");

// Crear un Story
const createStory = async (req, res) => {
    try {
      const user_id = req.user.id;
      const { description } = req.body;
  
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Debes subir un archivo para el Story" });
      }
  
      // Subir nuevo story
      const mediaFile = req.files[0];
      const mediaUrl = `/uploads/${mediaFile.filename}`;
  
      const insertQuery = `
        INSERT INTO stories (user_id, image_url, description)
        VALUES (@user_id, @image_url, @description)
      `;
  
      const inputs = [
        { name: "user_id", type: db.Int, value: user_id },
        { name: "image_url", type: db.NVarChar, value: mediaUrl },
        { name: "description", type: db.NVarChar, value: description || '' },
      ];
  
      await executeQuery(insertQuery, inputs);
      res.status(201).json({ message: "Story creado exitosamente" });
    } catch (error) {
      console.error("Error al crear Story:", error);
      res.status(500).json({ message: "Error al crear Story" });
    }
  };

// Obtener Stories de usuarios seguidos
const getFollowingStories = async (req, res) => {
  const user_id = req.user.id;

  try {
    const query = `
    SELECT 
      s.story_id,
      s.image_url,
      s.description,
      s.created_at,
      u.user_id,
      u.user_handle,
      u.avatar_url,
      u.first_name,
      u.last_name
    FROM stories s
    JOIN users u ON s.user_id = u.user_id
    JOIN followers f ON f.following_id = u.user_id
    WHERE 
      f.follower_id = @user_id AND
      s.created_at >= DATEADD(HOUR, -24, GETDATE())
    ORDER BY s.created_at DESC
  `;

    const inputs = [{ name: "user_id", type: db.Int, value: user_id }];
    const results = await executeQuery(query, inputs);

    // Agrupar Stories por usuario
    const storiesByUser = results.recordset.reduce((acc, story) => {
      const userId = story.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          user: {
            id: userId,
            handle: story.user_handle,
            avatar: story.avatar_url,
            name: `${story.first_name} ${story.last_name}`
          },
          stories: []
        };
      }
      acc[userId].stories.push({
        id: story.story_id,
        url: story.image_url,
        description: story.description,
        createdAt: story.created_at
      });
      return acc;
    }, {});

    res.status(200).json({ stories: Object.values(storiesByUser) });
  } catch (error) {
    console.error("Error al obtener Stories:", error);
    res.status(500).json({ message: "Error al obtener Stories" });
  }
};

module.exports = {
  createStory,
  getFollowingStories
};