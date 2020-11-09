module.exports = (ConnexionDb, Sequelize) => {
    return ConnexionDb.define(
        "enchere", {

            id: {

                // Définir le type de données
                type: Sequelize.DataTypes.INTEGER,

                // Définir si oui ou non elle sera primaryKey
                primaryKey: true,

                // AutoIncrement peut être utilisé pour créer des colonnes entières auto-incrémentées
                autoIncrement: true
            },

            maximum_dix_surenchere: {

                // Définit le type de données avec une longueur maximale
                type: Sequelize.DataTypes.INTEGER,

                // AllowNull false signifie qu'une erreur se produira si vous ajoutez des informations dans ce colonne
                allowNull: false
            },
            prix_surenchere: {

                // Définit le type de données avec une longueur maximale
                type: Sequelize.DataTypes.DECIMAL(7, 2),

                // AllowNull false signifie qu'une erreur se produira si vous ajoutez des informations dans ce colonne
                allowNull: false
            },
            prix_minimum: {

                // Définit le type de données avec une longueur maximale
                type: Sequelize.DataTypes.DECIMAL(7, 2),

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