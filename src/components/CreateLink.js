import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { LINKS_PER_PAGE } from '../Constants';
import { FEED_QUERY } from './LinkList';

const POST_MUTATION = gql`
	mutation PostMutation($description: String!, $url: String!) {
		post(description: $description, url: $url) {
			id
			createdAt
			url
			description
		}
	}
`;

const CreateLink = props => {
	const [description, setDescription] = useState('');
	const [url, setUrl] = useState('');
	return (
		<div>
			<div className="flex flex-column mt3">
				<input
					type="text"
					className="mb2"
					value={description}
					onChange={e => setDescription(e.target.value)}
					placeholder="A description for the link"
				/>
				<input
					type="text"
					className="mb2"
					value={url}
					onChange={e => setUrl(e.target.value)}
					placeholder="The URL for the link"
				/>
			</div>
			<Mutation
				mutation={POST_MUTATION}
				variables={{ description, url }}
				onCompleted={() => props.history.push('/new/1')}
				update={(store, { data: { post } }) => {
					const first = LINKS_PER_PAGE;
					const skip = 0;
					const orderBy = 'createdAt_DESC';
					const data = store.readQuery({
						query: FEED_QUERY,
						variables: { first, skip, orderBy }
					});
					data.feed.links.unshift(post);
					store.writeQuery({
						query: FEED_QUERY,
						data,
						variables: { first, skip, orderBy }
					});
				}}
			>
				{postMutation => <button onClick={postMutation}>Submit</button>}
			</Mutation>
		</div>
	);
};

export default CreateLink;
