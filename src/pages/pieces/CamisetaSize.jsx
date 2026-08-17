import PieceSizeForm from '../../components/PieceSizeForm'
import { PIECE_KEYS } from '../../constants/roles'

export default function CamisetaSize() {
  return (
    <PieceSizeForm
      title="Cadastrar tamanho da camiseta"
      sizeLabel="Tamanho da camiseta"
      pieceKey={PIECE_KEYS.CAMISETA}
    />
  )
}
