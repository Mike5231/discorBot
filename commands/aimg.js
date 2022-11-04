const { SlashCommandBuilder } = require("@discordjs/builders");
const url = 'https://kitsu.io/api/edge/anime';
const fetch = require("node-fetch");
const moment = require("moment");
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("img")
        .setDescription("Bring information about Animes.")
        .addSubcommand(subcommand =>
			subcommand
				.setName("anime")
				.setDescription("Bring information about Animes.")
				.addStringOption(option =>
					option.setName("searchterms").setDescription("search keywords").setRequired(true)
				)
		),
	execute: async ({ client, interaction }) => {
        function createRouteFlv(animeName) {
            let name = "https://www3.animeflv.net/browse?q=";
            const work = animeName.split(' ');
            for (let i = 0; i < work.length; i++) {
                if (i > 0) {
                    name = name + "+";
                }
                name = name + work[i];
            }
            return name;
        }
        function descriptionCreater(cadena = '') {
            let name2 = "";
            let rotation = 0;
            let cut = cadena.split('');
            for (let i = 0; i < 1000; i++) {
                name2 = name2 + cut[i];
                if (cut[i] == ".") {
                    rotation = i + 1;
                }
            }
            let extraida = name2.substring(0, rotation);
            return extraida;
        }
        function createEmbed(response = '', name = '') {
            let data = response.data;
            const embedDefault = new EmbedBuilder()
                .setTitle("500")
                .setDescription("ANIME DOES NOT EXISTS!")
                .setThumbnail('https://cdn.dribbble.com/users/63485/screenshots/4331748/002_maze_beautiful_errors_final.gif')
                .setImage('https://ginbits.com/wp-content/uploads/2021/08/How-to-Fix-500-Internal-Server-Error.png');
            if (data.length > 0) {
                let name2 = response.data[0].attributes.synopsis;
                let status = response.data[0].attributes.status;
                let date = moment(response.data[0].attributes.nextRelease).utc().format('YYYY-MM-DD');
                let abbreviatedTitles = response.data[0].attributes.abbreviatedTitles;
                const embed = new EmbedBuilder()
                    .setTitle(response.data[0].attributes.titles.en)
                    .setDescription(descriptionCreater(name2))
                    .addFields(
                        { name: 'Extra names', value: abbreviatedTitles.length > 0 ? abbreviatedTitles[0] : "Does not exists", inline: true },
                        { name: 'Next episode', value: status != "current" ? "Finished" : date == "Invalid date" ? "No date" : date, inline: false },
                       )
	                .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL()})
                    .setImage(response.data[0].attributes.posterImage.medium)
                    .setURL(createRouteFlv(name))
                    .setFooter({ text: "Request by: " + interaction.member.displayName, iconURL: interaction.user.avatarURL() });
                    //.setFooter('Requested by: ' + message.member.displayName, message.author.avatarURL());
                return embed;
            }
            return embedDefault;
        }
        function createRoute(animeName) {
            let name = "?filter%5Btext%5D=";
            const work = animeName.split(' ');
            for (let i = 0; i < work.length; i++) {
                if (i > 0) {
                    name = name + "%20";
                }
                name = name + work[i];
            }
            return name;
        }

        async function searchAnime(animeName) {
            try {
                const res = await fetch(url + createRoute(animeName));
                if (res.status = 200) {
                    const response = await res.json();
                    return response;
                } else {
                    console.log(res);
                    throw new Error("Bad response from server");
                }
            } catch (err) {
                console.error(err);
            }
        }
        const animeName = interaction.options.getString("searchterms");
        console.log(animeName);
        const response = await searchAnime(animeName);
        await interaction.reply({
            embeds: [createEmbed(response, animeName)]
        })
	},
}

