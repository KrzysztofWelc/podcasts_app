"""BlacklistedYoken model added

Revision ID: 2af24cfe5d52
Revises: 
Create Date: 2020-11-17 12:15:01.363486

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2af24cfe5d52'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('black_listed_token',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('token', sa.String(length=40), nullable=False),
    sa.Column('blacklisted_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('black_listed_token')
    # ### end Alembic commands ###