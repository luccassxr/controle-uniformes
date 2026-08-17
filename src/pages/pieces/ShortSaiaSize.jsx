import PieceSizeForm from '../../components/PieceSizeForm'
import { PIECE_KEYS } from '../../constants/roles'

export default function ShortSaiaSize() {
  return (
    <PieceSizeForm
      title="Cadastro de short saia"
      sizeLabel="Tamanho do short saia"
      pieceKey={PIECE_KEYS.SHORT_SAIA}
    />
  )
}
