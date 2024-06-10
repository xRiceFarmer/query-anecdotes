import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAnecdote, getAnecdotes } from './requests'
import { useNotification } from './NotificationContext'

const App = () => {

  const [notification, dispatch] = useNotification()
  const queryClient = useQueryClient()
  
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    }
  })

  const handleVote = (anecdote) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes+1
    }
    voteMutation.mutate(updatedAnecdote,
      {
      onSuccess: () => {
        dispatch({type: 'SET_NOTIFICATION', payload: `voted ${anecdote.content}`})
        setTimeout(() => {
          dispatch({type: 'CLEAR_NOTIFICATION'})
        }, 5000)
      }
    }
      )
  }
  
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  if ( result.error ) {
    return <div>error communicating with the server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
