import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import { AUTH_TOKEN } from '../Constants';
import { timeDifferenceForDate } from '../utils';

const VOTE_MUTATION = gql`
	mutation VoteMutation($linkId: ID!) {
		vote(linkId: $linkId) {
			id
			link {
				votes {
					id
					user {
						id
					}
				}
			}
			user {
				id
			}
		}
	}
`;

const Link = props => {
	const authToken = localStorage.getItem(AUTH_TOKEN);
	return (
		<div className="flex mt2 item-start">
			<div className="flex items-center">
				<span className="gray">{props.index + 1}.</span>
				{authToken && (
					<Mutation
						mutation={VOTE_MUTATION}
						variables={{ linkId: props.link.id }}
						update={(store, { data: { vote } }) =>
							props.updateStoreAfterVote(
								store,
								vote,
								props.link.id
							)
						}
					>
						{voteMutation => (
							<div
								className="pointer ml1 gray f11"
								onClick={voteMutation}
							>
								▲
							</div>
						)}
					</Mutation>
				)}
			</div>
			<div className="ml1">
				<div>
					{props.link.description} ({props.link.url})
				</div>
				<div className="f6 lh-copy-gray">
					{props.link.votes.length} votes | by{' '}
					{props.link.postedBy ? props.link.postedBy.name : 'Unkown'}{' '}
					{timeDifferenceForDate(props.link.createdAt)}
				</div>
			</div>
		</div>
	);
};

export default Link;
