import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests' 
import { useNotification } from '../NotificationContext'

const AnecdoteForm = () => {
  const [notification, dispatch] = useNotification()
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
    onError: (error) => {
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: error['response'].data.error,
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
      console.log(error['response'].data.error)
    }
  })

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value.trim();
    console.log(content)
    if (content) {
      newAnecdoteMutation.mutate(
        { content, votes: 0 },
        {
          onSuccess: () => {
            dispatch({
              type: 'SET_NOTIFICATION',
              payload: `A new anecdote '${content}' added`,
            });
            setTimeout(() => {
              dispatch({ type: 'CLEAR_NOTIFICATION' });
            }, 5000);
         }
        });
      event.target.anecdote.value = '';
    }
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
