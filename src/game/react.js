const { MessageEmbed } = require('discord.js');
const game = require('../game');
/**
 * @param {import('discord.js').MessageReaction} reaction
 * @param {import('discord.js').User} user
 * @param {import('node-cache')} cache
 */
module.exports = async (reaction, user, cache) => {
    const gameCache = cache.get(user.id);
    const message = reaction.message;
    const board = gameCache.board;
    const level = gameCache.level;

    let moves = gameCache.reacts;

    switch(reaction.emoji.name) {
        case '⬆️': {
            moves.push('Up');
            await reaction.users.remove(user);
            break;
        }

        case '⬇️': {
            moves.push('Down');
            await reaction.users.remove(user);
            break;
        }

        case '⬅️': {
            moves.push('Left');
            await reaction.users.remove(user);
            break;
        }

        case '➡️': {
            moves.push('Right');
            await reaction.users.remove(user);
            break;
        }

        case '🇵': {
            moves.push('Pull');
            await reaction.users.remove(user);
            break;
        }

        case '🔂': {
            moves.pop();
            await reaction.users.remove(user);
            break;
        }

        case '🔁': {
            moves = [];
            await reaction.users.remove(user);
            break;
        }

        case '▶️': {
            game.move(message, user, cache, moves);
            await reaction.users.remove(user);
            return;
        }

        case '⏩': {
            game.generate(message, user, cache, gameCache.level + 1);
            return;
        }

        case '⏹️': {
            cache.del(user.id);
            return;
        }
    }

    const embed = new MessageEmbed()
        .setAuthor(`Level ${level}`)
        .setDescription(`${board.join('')}\n\n__**Moves:**__\n**>** ${moves.join('\n**>** ')}`)
        .setFooter('Number of moves: 0');

    await message.edit(embed);

    const gameState = {
        board: board,
        width: gameCache.width,
        height: gameCache.height,
        level: level,
        numMoves: gameCache.numMoves,
        onGoal: gameCache.onGoal,
        isPull: gameCache.isPull,
        reacts: moves,
        messageID: message.id
    }

    cache.set(user.id, gameState, 900);
};
