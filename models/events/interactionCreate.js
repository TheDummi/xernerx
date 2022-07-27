const { Event } = require('../commands/Event.js');
const { interactionArgs, access } = require('./../data/Functions.js');
const { InteractionType } = require('discord.js')
/**
 * @returns interaction command executor.
 */
class BuildInInteractionEvent extends Event {
    constructor() {
        super('interactionCreate', {
            name: 'interactionCreate',
            type: 'client',
            once: false,
        })
    }

    async run(interaction) {
        if (interaction.type == InteractionType.ApplicationCommand) {
            if (interaction.client.interactionCommands.has(interaction.commandName)) {
                let command = interaction.client.interactionCommands.get(interaction.commandName);

                command.client = interaction.client;

                const group = interactionArgs(interaction).group;

                const subcommand = interactionArgs(interaction).sub;

                const args = interactionArgs(interaction).options;

                if (access(interaction, command)) return;

                try {
                    await command.exec(interaction, { group: group, subcommand: subcommand, args: args });

                    return interaction.client.emit('commandRun', interaction, "interaction", command)
                }
                catch (error) {
                    return interaction.client.emit("error", interaction, error);
                }
            }

            if (interaction.client.contextMenuCommands.has(interaction.commandName)) {
                let command = interaction.client.contextMenuCommands.get(interaction.commandName);

                command.client = interaction.client;

                try {
                    await command.exec(interaction);

                    return interaction.client.emit('commandRun', interaction, 'contextMenu', command);
                }
                catch (error) {
                    return interaction.client.emit("error", interaction, error);
                }
            }
        }
    }
}

module.exports = BuildInInteractionEvent;