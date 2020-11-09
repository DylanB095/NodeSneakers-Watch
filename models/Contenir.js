module.exports = (ConnexionDb, Sequelize) => {
    return ConnexionDb.define(
        "contenir", {

            quantiter: {

                  // Définit le type de données avec une longueur maximale
                type: Sequelize.DataTypes.INTEGER,

                // AllowNull false signifie qu'une erreur se produira si vous ajoutez des informations dans ce colonne
                allowNull: false
            },

        }, {
            // Par défaut, timestamps ajoutera les attributs createdAt et updatedAt à
            //votre modèle afin que vous puissiez savoir quand l'entrée de la base de données a été insérée dans la base de données et quand elle a été mise à jour pour la dernière fois.
            timestamps: true,

            // underscored permet de mettre en surbrillance l'option soulignée pour le modèle. Lorsque la valeur est true, cette option 
            // définit l'option de champ de tous les attributs sur la version soulignée de son nom. 
            underscored: true
        }
    );
};